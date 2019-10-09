import { config } from '../config';
import * as nats from 'nats';
import * as Hemera from 'nats-hemera';

let natsClient: nats.Client;
let hemeraInstance;
export const clientGen: () => nats.Client = () => {

    if (!natsClient) {
        natsClient = nats.connect({
            'url': config.NATS_URL,
            'user': config.NATS_USER,
            'pass': config.NATS_PW as string,
            reconnectTimeWait: 1000,
        });
    }
    return natsClient;
};


export const hemeraGen: () => Hemera<any, any> = () => {

    if (!hemeraInstance) {
        hemeraInstance = new Hemera(clientGen(), {
            logLevel: process.env.HEMERA_LOG_LEVEL as Hemera.LogLevel || 'info',
            childLogger: true,
            tag: 'hemera-server',
            timeout: 10000,
        });
    }
    return hemeraInstance;
};
