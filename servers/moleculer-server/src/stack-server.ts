
import { config } from './config';
import { logger as serverLogger } from '@cdm-logger/server';
import * as ILogger from 'bunyan';
import { ConnectionBroker } from './connectors/connection-broker';
import { Feature } from '@common-stack/server-core';
import { ContainerModule, interfaces, Container } from 'inversify';
import { ServiceBroker, ServiceSettingSchema } from 'moleculer';
import * as brokerConfig from './config/moleculer.config';
import modules, { settings } from './modules';
import { CommonType } from '@common-stack/core';


function infraModule( broker, pubsub, logger) {
    return () => new ContainerModule((bind: interfaces.Bind) => {
        bind('Logger').toConstantValue(serverLogger);
        bind(CommonType.LOGGER).toConstantValue(serverLogger);
        bind('Environment').toConstantValue(config.NODE_ENV || 'development');
        bind(CommonType.ENVIRONMENT).toConstantValue(config.NODE_ENV || 'development');
        bind('PubSub').toConstantValue(pubsub);
        bind(CommonType.PUBSUB).toConstantValue(pubsub);
        bind('MoleculerBroker').toConstantValue(broker);
        bind(CommonType.MOLECULER_BROKER).toConstantValue(broker);
    });
}




/**
 *  Controls the lifecycle of the Application Server
 *
 * @export
 * @class StackServer
 */
export class StackServer {

    private logger: ILogger;
    private connectionBroker: ConnectionBroker;
    private microserviceBroker: ServiceBroker;

    private serviceContainer: Container;
    private micorserviceContainer: Container;
    constructor() {
        this.logger = serverLogger.child({ className: 'StackServer' });
    }

    public async  initialize() {
        this.logger.info('StackServer initializing');

        let serviceBroker;
        this.connectionBroker = new ConnectionBroker(brokerConfig.transporter, this.logger);
        const redisClient = this.connectionBroker.redisDataloaderClient;

        const mongoClient = await this.connectionBroker.mongoConnection;

        this.microserviceBroker = new ServiceBroker({
            ...brokerConfig,
            started: async () => {
                await modules.microservicePreStart(this.micorserviceContainer);
                await modules.microservicePostStart(this.micorserviceContainer);

            },
        });

        const pubsub = await this.connectionBroker.graphqlPubsub;
        const InfraStructureFeature = new Feature({
            createHemeraContainerFunc: [
                infraModule(
                   this.microserviceBroker,
                    pubsub,
                    this.logger,
                )],
        });
        const allModules = new Feature(InfraStructureFeature, modules);
        serviceBroker = {
            microserviceContainer: await allModules.createHemeraContainers({ ...settings, mongoConnection: mongoClient }),
            logger: this.logger,
        };
        // set the service container
        this.micorserviceContainer = serviceBroker.microserviceContainer;
        allModules.loadClientMoleculerService({
            broker: this.microserviceBroker,
            container: serviceBroker.microserviceContainer,
            settings: settings,
        });


    }

    public async start() {


        await this.microserviceBroker.start();
    }

    public async cleanup() {
        if (this.connectionBroker) {
            await this.connectionBroker.stop();
        }
        if (this.microserviceBroker) {
            await this.microserviceBroker.stop();
        }
    }
}

