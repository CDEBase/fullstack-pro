import 'reflect-metadata';
require('dotenv').config({ path: process.env.ENV_FILE });
import { ServiceBroker } from 'moleculer';
import brokerConfig from './moleculer.config';
import { createServices } from './create-services';
import { NATS_MOLECULER_COUNTER_SERIVCE } from '@sample-stack/counter-module-server';
import { config } from './config';
import * as nats from 'nats';

const client = nats.connect({
    'url': config.NATS_URL,
    'user': config.NATS_USER,
    'pass': config.NATS_PW,
});


const subTopic = `${config.NAMESPACE}/${config.CONNECTION_ID}`; // PrefernceUpdateHemera/filesServer/namespace/connection_id

const settings: any & { name: string } = {
    name: NATS_MOLECULER_COUNTER_SERIVCE,
    rootFilePath: config.FILE_ROOT_PATH,
    connectionId: config.CONNECTION_ID,
    namespace: config.NAMESPACE,
    subTopic,
    logger: config.LOG_LEVEL,
    workspaceId: config.CONNECTION_ID || 'DEFAULT',
    graphqlUrl: config.GRAPHQL_URL,
    configPath: process.env.CONFIG_PATH,
};

let broker = new ServiceBroker({ ...brokerConfig });

createServices(broker, client, settings).then(() => {
    broker.start();
});

