
import { config } from './config';
import { logger as serverLogger } from '@cdm-logger/server';
import { ConnectionBroker } from './connectors/connection-broker';
import { Feature } from '@common-stack/server-core';
import { ContainerModule, interfaces, Container } from 'inversify';
import { ServiceBroker, ServiceSettingSchema } from 'moleculer';
import * as brokerConfig from './config/moleculer.config';
import modules, { settings } from './modules';
import { CommonType } from '@common-stack/core';
import { CdmLogger } from '@cdm-logger/core';
type ILogger = CdmLogger.ILogger;


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
    private microserviceContainer: Container;
    constructor() {
        this.logger = serverLogger.child({ className: 'StackServer' });
    }

    public async  initialize() {
        this.logger.info('StackServer initializing');

        this.connectionBroker = new ConnectionBroker(brokerConfig.transporter, this.logger);
        const redisClient = this.connectionBroker.redisDataloaderClient;

        const mongoClient = await this.connectionBroker.mongoConnection;

        this.microserviceBroker = new ServiceBroker({
            ...brokerConfig,
            started: async () => {
                await modules.microservicePreStart(this.microserviceContainer);
                await modules.microservicePostStart(this.microserviceContainer);

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
        this.microserviceContainer = await allModules.createHemeraContainers({ ...settings, mongoConnection: mongoClient });
        const serviceBroker = {
            microserviceContainer: this.microserviceContainer,
            logger: this.logger,
        };
        // set the service container
        this.microserviceContainer = serviceBroker.microserviceContainer;
        allModules.loadClientMoleculerService({
            broker: this.microserviceBroker,
            container: this.microserviceContainer,
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

