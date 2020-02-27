import * as http from 'http';
import * as express from 'express';
import { expressApp } from './express-app';
import { GraphqlServer } from './graphql-server';
import { config } from './config';
import { logger as serverLogger } from '@cdm-logger/server';
import * as ILogger from 'bunyan';
import { ConnectionBroker } from './connectors/connection-broker';
import { Feature } from '@common-stack/server-core';
import { ContainerModule, interfaces } from 'inversify';
import { ServiceBroker, ServiceSettingSchema } from 'moleculer';
import * as brokerConfig from './config/moleculer.config';
import { pubsubGen } from './connectors/pubsub';
import modules, { settings } from './modules';
import { contextServicesMiddleware } from './middleware/services';
function startListening(port) {
    let server = this;
    return new Promise((resolve) => {
        server.listen(port, resolve);
    });
}

const infraModule =
    ({ broker, pubsub, logger }) => new ContainerModule((bind: interfaces.Bind) => {
        bind('Logger').toConstantValue(logger);
        bind('Environment').toConstantValue(config.NODE_ENV || 'development');
        bind('PubSub').toConstantValue(pubsub);

        if (config.NODE_ENV !== 'development') {
            bind('MoleculerBroker').toConstantValue(broker);
        }
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

        this.connectionBroker = new ConnectionBroker();
        const redisClient = this.connectionBroker.redisDataloaderClient;
        const natsClient =  await this.connectionBroker.natsConnection;
        const mongoClient = await this.connectionBroker.mongoConnection;

        this.microserviceBroker = new ServiceBroker({ ...brokerConfig });

        const pubsub = pubsubGen(natsClient);
        const InfraStructureFeature = new Feature({
            createContainerFunc: [
                () => infraModule({ broker: this.microserviceBroker, pubsub, logger: serverLogger })],
        });
        const allModules = new Feature(InfraStructureFeature, modules);
        const serviceBroker = {
            serviceContainer: await allModules.createContainers(settings),
            serviceContext: allModules.createServiceContext(settings),
            dataSource: allModules.createDataSource(),
            defaultPreferences: allModules.createDefaultPreferences(),
            createContext: async (req, res) => await allModules.createContext(req, res),
            logger: serverLogger,
            schema: allModules.schemas,
            resolvers: allModules.createResolvers({
                pubsub,
                logger: serverLogger,
                subscriptionID: `${settings.subTopic}`,
            }),
            directives: allModules.createDirectives({ logger: this.logger }),
        };


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

        // Initialize an express app, apply the apollo middleware, and mount the app to the http server
        const graphqlServer = new GraphqlServer(this.app, this.httpServer, redisClient, serviceBroker);
        await graphqlServer.initialize();
    }

    public async start() {


        await this.microserviceBroker.start();
    }

    public async cleanup() {
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
