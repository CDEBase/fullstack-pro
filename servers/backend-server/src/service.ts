import { StackServer } from './stack-server';
import { logger } from '@cdm-logger/server';
import * as url from 'url';
import { config } from './config';

const { port: serverPort, pathname, hostname } = url.parse(config.BACKEND_URL);

export class Service {

    private app: StackServer;

    public async initalize() {

        this.app = new StackServer();
        await this.app.initialize();
    }

    public async start() {
        await this.app.httpServer.startListening(serverPort);
        logger.info(`API is now running on port ${serverPort}`);
    }

    public async gracefulShutdown(signal) {
        try {
            logger.info(`${signal} received. Closing connections, stopping server`);
            await this.app.cleanup();
            logger.info('Shutting down');
        } catch (err) {
            logger.error('Error during graceful shutdown');
            logger.error(err);
        } finally {
            process.exit(0);
        }
    }
}
