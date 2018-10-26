import * as http from 'http';
import app, { graphqlServer } from './app';
import { logger } from '@cdm-logger/server';
import * as url from 'url';
import { config } from './config';

let httpServer: http.Server;
const { protocol, port: serverPort, pathname, hostname } = url.parse(config.BACKEND_URL);

httpServer = http.createServer(app);
// httpServer.on('request', app);

graphqlServer.installSubscriptionHandlers(httpServer);

const serverPromise = new Promise(resolve => {
    httpServer.listen(serverPort, () => {
      logger.info(`API is now running on port ${serverPort}`);
      resolve(httpServer);
    });
  });
httpServer.on('close', () => {
    httpServer = undefined;
});

if (module.hot) {
    module.hot.dispose(() => {
        try {
            if (httpServer) {
                httpServer.close();
            }
        } catch (error) {
            logger.error(error.stack);
        }
    });
    module.hot.accept(['./middleware/graphql'], () => {
        logger.debug('loading ./middleware/graphql');
    });
    // module.hot.accept(['./api/subscriptions'], () => {
    //     try {
    //         addGraphQLSubscriptions(httpServer);
    //     } catch (error) {
    //         logger.error(error.stack);
    //     }
    // });

    module.hot.accept();
}

export default serverPromise;
