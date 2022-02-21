/* eslint-disable guard-for-in */
/* eslint-disable no-continue */
/* eslint-disable no-prototype-builtins */
import * as url from 'url';
import * as WebSocket from 'ws';
import { Server } from 'http';
import { RedisClusterCache, RedisCache } from 'apollo-server-cache-redis';
import { useServer } from 'graphql-ws/lib/use/ws';

import { GRAPHQL_ROUTE } from '../constants';
// import { GraphqlSubscriptionServer } from './graphql-subscription-server';
import { GraphqlWs } from './graphql-ws';
import { IModuleService } from '../interfaces';

interface WebSocketsCache {
    [key: string]: WebSocket.Server;
}

interface MultiWebsocketConfig {
    [key: string]: any;
}
export class WebsocketMultiPathServer {
    private webSockets: WebSocketsCache = {};

    // private graphqlSubscriptionServer: GraphqlSubscriptionServer | GraphqlWs;
    // private graphqlSubscriptionServer: GraphqlWs;

    constructor(
        moduleService: IModuleService,
        cache: RedisCache | RedisClusterCache,
        multiplePathConfig?: MultiWebsocketConfig,
    ) {
        // const websocket = new WebSocket.Server({ noServer: true, path: GRAPHQL_ROUTE });
        // // this.graphqlSubscriptionServer = new GraphqlSubscriptionServer(moduleService, cache, websocket);
        // this.graphqlSubscriptionServer = new GraphqlWs(moduleService, cache, websocket);
        // // this.webSockets[GRAPHQL_ROUTE] = this.graphqlSubscriptionServer.create().server;
        // this.graphqlSubscriptionServer.create();
        // this.webSockets[GRAPHQL_ROUTE] = websocket;
        // console.log('---LLLL', this.webSockets, multiplePathConfig);
        // for (const key in multiplePathConfig) {
        //     console.log('---KEY---', key);
        //     if (!multiplePathConfig.hasOwnProperty(key)) {
        //         continue;
        //     }
        //     if (!this.webSockets[key]) {
        //         this.webSockets[key] = new WebSocket.Server({ noServer: true });
        //         this.webSockets[key].on('connection', (ws, request) => {
        //             console.log('--WBesocket connection');
        //             Promise.all([
        //                 moduleService.createContext(request, null),
        //                 moduleService.serviceContext(request, null),
        //             ]).then((values) => multiplePathConfig[key](merge(values), ws));
        //         });
        //     }
        // }
        const websocket = new WebSocket.Server({ noServer: true, path: GRAPHQL_ROUTE });

        this.webSockets[GRAPHQL_ROUTE] = websocket;
        this.webSockets[GRAPHQL_ROUTE].on('connection', (ws, request) => {
            useServer({
                schema: moduleService.schema,
            }, websocket);
        }
    }

    public httpServerUpgrade(httpServer: Server) {
        httpServer.on('upgrade', (request, socket, head) => {
            const { pathname } = url.parse(request.url);

            if (!this.webSockets[pathname]) {
                // in development 
                if (pathname !== '/sockjs-node') {
                    // need to destroy
                    socket.destroy();
                }

            }

            // code to run when a new connection is made
            this.webSockets[pathname].handleUpgrade(request, socket, head, (ws) => {
                this.webSockets[pathname].emit('connection', ws, request);
            });
        });
        return httpServer;
    }

    public close() {
        // tslint:disable-next-line:forin
        for (const key in this.webSockets) {
            this.webSockets[key].close();
        }
    }
}
