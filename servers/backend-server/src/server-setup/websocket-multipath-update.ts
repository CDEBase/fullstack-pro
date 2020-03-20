


import * as url from 'url';
import { GRAPHQL_ROUTE } from '../constants';
import { GraphqlSubscriptionServer } from './graphql-subscription-server';
import * as WebSocket from 'ws';
import { IModuleService } from '../interfaces';
import { Server } from 'http';

interface WebSocketsCache {
    [key: string]: WebSocket.Server;
}

interface MultiWebsocketConfig {
    [key: string]: any;
}
export class WebsocketMultiPathServer {

    private webSockets: WebSocketsCache = {};
    private graphqlSubscriptionServer: GraphqlSubscriptionServer;
    constructor(
        moduleService: IModuleService,
        multiplePathConfig?: MultiWebsocketConfig,
    ) {
        this.graphqlSubscriptionServer = new GraphqlSubscriptionServer(moduleService);
        this.webSockets[GRAPHQL_ROUTE] = this.graphqlSubscriptionServer.create().server;
        for (let key in multiplePathConfig) {
            if (!multiplePathConfig.hasOwnProperty(key)) { continue; }

            if (!this.webSockets[key]) {
                this.webSockets[key] = new WebSocket.Server({ noServer: true });
                this.webSockets[key].on('connection', () => {});
            }
        }
        console.log('---WeBSOCKETS ', this.webSockets)

    }

    public httpServerUpgrade(httpServer: Server) {
        httpServer.on('upgrade', (request, socket, head) => {
            console.log('----ON UPGRADE CALLED')
            const pathname = url.parse(request.url).pathname;

            if (!this.webSockets[pathname]) {
                console.log('Destroying.....pathname', pathname)
                // this.webSockets[pathname] = new WebSocket.Server({ noServer: true });
                // this.webSockets[pathname].on('connection', {});
                // need to destroy
                // socket.destroy();
            }

            // code to run when a new connection is made
            this.webSockets[pathname].handleUpgrade(request, socket, head, (ws) => {
                console.log('---HANDLE UPGRADE')
                this.webSockets[pathname].emit('connection', ws, request);
            });
        });
        return httpServer;
    }

    public close() {
        // tslint:disable-next-line:forin
        for (let key in this.webSockets) {
            this.webSockets[key].close();
        }
    }
}


