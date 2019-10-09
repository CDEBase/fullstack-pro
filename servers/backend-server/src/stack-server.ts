import * as http from 'http';
import * as express from 'express';
import { schemaBuilder } from './api/schema';
import { expressApp } from './express-app';
import { graphqlServer } from './graphql-server';
import { GRAPHQL_ROUTE } from './ENDPOINTS';
import * as url from 'url';
import { config } from './config';

const { protocol, port: serverPort, pathname, hostname } = url.parse(config.BACKEND_URL);

export class StackServer {

    public httpServer: http.Server & { startListening?: (port) => void; };
    private schema;
    private app: express.Express;
    private apolloServer;

    public async  initialize() {
        this.httpServer = http.createServer();
        this.schema = await schemaBuilder;
        this.startServer();

        function startListening(port) {
            let server = this;
            return new Promise((resolve) => {
                server.listen(port, resolve);
            });
        }

        this.httpServer.startListening = startListening.bind(this.httpServer);
    }

    public async cleanup() {
        if (this.httpServer) {
            await this.httpServer.close();
        }
    }

    private startServer() {
        // Initialize an express app, apply the apollo middleware, and mount the app to the http server
        this.app = expressApp({}, {});
        this.apolloServer = graphqlServer(this.app, this.schema, this.httpServer, GRAPHQL_ROUTE);
        this.httpServer.on('request', this.app);
        this.httpServer.on('close', () => {
            this.httpServer = undefined;
        });
    }
}
