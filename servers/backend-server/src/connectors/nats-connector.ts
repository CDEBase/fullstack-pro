import * as nats from 'nats';
import * as _ from 'lodash';
import { logger } from '@cdm-logger/server';
import { CdmLogger } from '@cdm-logger/core';
type ILogger = CdmLogger.ILogger;


export class NatsConnector {


    private opts: nats.ClientOpts;
    private client: nats.Client;
    private logger: ILogger;
    private connected: boolean;

    constructor(opts: nats.ClientOpts) {
        this.opts = _.defaultsDeep(opts, {});
        this.logger = logger.child({ className: 'NatsConnector' });
    }
    /**
     * Connect to a NATS server
     *
     * @memberof NatsConnector
     */
    public connect() {
        if (this.client) {
            return this.client;
        }
        return new Promise<nats.Client>((resolve, reject) => {
            const client = nats.connect(this.opts);

            client.on('connect', () => {
                this.client = client;
                this.connected = true;
                this.logger.info('NATS client is connected.');
                resolve(client);
            });

            client.on('reconnect', () => {
                this.logger.info('NATS client is reconnected.');
                this.connected = true;
            });

            client.on('reconnecting', () => {
                this.logger.warn('NATS client is reconnecting...');
            });

            client.on('disconnect', () => {
                if (this.connected) {
                    this.logger.warn('NATS client is disconnected.');
                    this.connected = false;
                }
            });

            client.on('error', e => {
                this.logger.error('NATS error.', e.message);
                this.logger.debug(e);
                reject(e);

            });

            client.on('close', () => {
                this.logger.fatal('NATS connection close.');
            });
        });

    }

    /**
     * Disconnect from a NATS server
     *
     * @memberof NatsTransporter
     */
    public disconnect() {
        if (this.client) {
            this.client.flush(() => {
                this.client.close();
                this.client = null;
            });
        }
    }
}
