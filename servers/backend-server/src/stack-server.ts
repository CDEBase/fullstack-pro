import * as http from 'http';
import * as express from 'express';
import { expressApp } from './express-app';
import { GraphqlServer } from './server-setup/graphql-server';
import { config } from './config';
import { logger as serverLogger } from '@cdm-logger/server';
import * as ILogger from 'bunyan';
import { ConnectionBroker } from './connectors/connection-broker';
import { Feature } from '@common-stack/server-core';
import { ContainerModule, interfaces } from 'inversify';
import { ServiceBroker, ServiceSettingSchema } from 'moleculer';
import * as brokerConfig from './config/moleculer.config';
import modules, { settings } from './modules';
import { GatewaySchemaBuilder } from './api/schema-builder';
import { contextServicesMiddleware } from './middleware/services';
import { WebsocketMultiPathServer } from './server-setup/websocket-multipath-update';
import { IModuleService } from './interfaces';
import { CommonType } from '@common-stack/core';
import * as _ from 'lodash';




function startListening(port) {
    let server = this;
    return new Promise((resolve) => {
        server.listen(port, resolve);
    });
}

const infraModule =
    ({ broker, pubsub, logger }) => new ContainerModule((bind: interfaces.Bind) => {
        bind('Logger').toConstantValue(logger);
        bind(CommonType.LOGGER).toConstantValue(logger);
        bind('Environment').toConstantValue(config.NODE_ENV || 'development');
        bind(CommonType.ENVIRONMENT).toConstantValue(config.NODE_ENV || 'development');
        bind('PubSub').toConstantValue(pubsub);
        bind(CommonType.PUBSUB).toConstantValue(pubsub);
        bind('MoleculerBroker').toConstantValue(broker);
        bind(CommonType.MOLECULER_BROKER).toConstantValue(broker);
    });





/**
 *  Controls the lifecycle of the Application Server
 *
 * @export
 * @class StackServer
 */
export class StackServer {

    public httpServer: http.Server & { startListening?: (port) => void; };
    private app: express.Express;
    private logger: ILogger;
    private connectionBroker: ConnectionBroker;
    private microserviceBroker: ServiceBroker;
    private multiPathWebsocket: WebsocketMultiPathServer;
    constructor() {
        this.logger = serverLogger.child({ className: 'StackServer' });
    }

    public async  initialize() {
        this.logger.info('StackServer initializing');
        this.httpServer = http.createServer();
        this.app = expressApp({}, null);



        this.httpServer.startListening = startListening.bind(this.httpServer);
        this.httpServer.on('request', this.app);
        this.httpServer.on('close', () => {
            this.httpServer = undefined;
        });

        this.connectionBroker = new ConnectionBroker(brokerConfig.transporter, this.logger);
        const redisClient = this.connectionBroker.redisDataloaderClient;
        const mongoClient = await this.connectionBroker.mongoConnection;

        // Moleculer Broker Setup
        this.microserviceBroker = new ServiceBroker({
            ...brokerConfig,
            started: async () => {
                await modules.preStart({});
                await modules.postStart({});
            },
            // created,
            created: async () => {

            },
        });

        const pubsub = await this.connectionBroker.graphqlPubsub;
        const InfraStructureFeature = new Feature({
            createContainerFunc: [
                () => infraModule({
                    broker: this.microserviceBroker,
                    pubsub, logger: serverLogger,
                })],
        });
        const allModules = new Feature(InfraStructureFeature, modules);

        const executableSchema = await (new GatewaySchemaBuilder({
            schema: allModules.schemas,
            resolvers: allModules.createResolvers({
                pubsub,
                logger: serverLogger,
                subscriptionID: `${settings.subTopic}`,
            }),
            directives: allModules.createDirectives({ logger: this.logger }),
            logger: serverLogger,
        })).build();
        // has dependencies on `pubsub` and `MoleculerBroker`
        const serviceBroker: IModuleService = {
            serviceContainer: await allModules.createContainers(settings),
            serviceContext: allModules.createServiceContext(settings),
            dataSource: allModules.createDataSource(),
            defaultPreferences: allModules.createDefaultPreferences(),
            createContext: async (req, res) => await allModules.createContext(req, res),
            logger: serverLogger,
            schema: executableSchema,
        };
        if (config.NODE_ENV === 'development') {
            allModules.loadClientMoleculerService({
                broker: this.microserviceBroker,
                container: await allModules.createHemeraContainers(settings),
                settings: settings,
            });
        }


        this.app.use((req: any, res: any, next) => {
            Promise.all([
                serviceBroker.createContext,
                serviceBroker.serviceContext(req, res),
            ])
                .then(([context, services]) => {
                    req.context = context;
                    req.services = services;

                    next();
                })
                .catch((err) => next());
        });

        const customWebsocket = allModules.getWebsocketConfig();
        const customWebsocketEnable = !_.isEmpty(customWebsocket);

        if (customWebsocketEnable) {
            this.multiPathWebsocket = new WebsocketMultiPathServer(serviceBroker, customWebsocket);
            this.httpServer = this.multiPathWebsocket.httpServerUpgrade(this.httpServer);
        }
        const graphqlServer = new GraphqlServer(this.app, this.httpServer, redisClient, serviceBroker, !customWebsocketEnable);


        await graphqlServer.initialize();
    }

    public async start() {
        await this.microserviceBroker.start();
    }

    public async cleanup() {
        if (this.multiPathWebsocket) {
            this.multiPathWebsocket.close();
        }
        if (this.httpServer) {
            await this.httpServer.close();
        }
        if (this.connectionBroker) {
            await this.connectionBroker.stop();
        }
        if (this.microserviceBroker) {
            await this.microserviceBroker.stop();
        }
    }

}
