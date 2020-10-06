import * as http from 'http';
import * as express from 'express';
import { expressApp } from './express-app';
import { GraphqlServer } from './server-setup/graphql-server';
import { config } from './config';
import { logger as serverLogger } from '@cdm-logger/server';
import { ConnectionBroker } from './connectors/connection-broker';
import { Feature } from '@common-stack/server-core';
import { ContainerModule, interfaces, Container } from 'inversify';
import { ServiceBroker, ServiceSettingSchema } from 'moleculer';
import * as brokerConfig from './config/moleculer.config';
import modules, { settings } from './modules';
import { GatewaySchemaBuilder } from './api/schema-builder';
import { WebsocketMultiPathServer } from './server-setup/websocket-multipath-update';
import { IModuleService } from './interfaces';
import { CommonType } from '@common-stack/core';
import * as _ from 'lodash';
import { CdmLogger } from '@cdm-logger/core';
type ILogger = CdmLogger.ILogger;


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

    private serviceContainer: Container;
    private microserviceContainer: Container;

    constructor() {
        this.logger = serverLogger.child({ className: 'StackServer' });
    }

    public async  initialize() {
        this.logger.info('StackServer initializing');

        this.connectionBroker = new ConnectionBroker(brokerConfig.transporter, this.logger);
        const redisClient = this.connectionBroker.redisDataloaderClient;
        const mongoClient = await this.connectionBroker.mongoConnection;

        // Moleculer Broker Setup
        this.microserviceBroker = new ServiceBroker({
            ...brokerConfig,
            started: async () => {
                await modules.preStart(this.serviceContainer);
                if (config.NODE_ENV === 'development') {
                    await modules.microservicePreStart(this.microserviceContainer);
                }

                await modules.postStart(this.serviceContainer);
                if (config.NODE_ENV === 'development') {
                    await modules.microservicePostStart(this.microserviceContainer);
                }
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
            createHemeraContainerFunc: [
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

        // set the service container
        this.serviceContainer = await allModules.createContainers({ ...settings, mongoConnection: mongoClient });
        const createServiceContext = allModules.createServiceContext({ ...settings, mongoConnection: mongoClient });
        const serviceBroker: IModuleService = {
            serviceContainer: this.serviceContainer,
            serviceContext: createServiceContext,
            dataSource: allModules.createDataSource(),
            defaultPreferences: allModules.createDefaultPreferences(),
            createContext: async (req, res) => await allModules.createContext(req, res),
            logger: serverLogger,
            schema: executableSchema,
        };
        allModules.loadMainMoleculerService({
            broker: this.microserviceBroker,
            container: this.serviceContainer,
            settings: settings,
        });
        if (config.NODE_ENV === 'development') {
            this.microserviceContainer = await allModules.createHemeraContainers({ ...settings, mongoConnection: mongoClient });
            allModules.loadClientMoleculerService({
                broker: this.microserviceBroker,
                container: this.microserviceContainer,
                settings: settings,
            });
        }

        // intialize Servers
        this.httpServer = http.createServer();
        this.app = await expressApp(serviceBroker, null, this.httpServer);



        this.httpServer.startListening = startListening.bind(this.httpServer);
        this.httpServer.on('request', this.app);
        this.httpServer.on('close', () => {
            this.httpServer = undefined;
        });

        const customWebsocket = allModules.getWebsocketConfig();
        const customWebsocketEnable = !_.isEmpty(customWebsocket);

        if (customWebsocketEnable) {
            this.multiPathWebsocket = new WebsocketMultiPathServer(serviceBroker, redisClient, customWebsocket);
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
