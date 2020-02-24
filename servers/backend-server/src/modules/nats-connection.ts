import { config } from '../config';
import * as nats from 'nats';

let natsClient: nats.Client;
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

