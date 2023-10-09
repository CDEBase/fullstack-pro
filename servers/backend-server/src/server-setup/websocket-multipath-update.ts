import * as url from 'url';
// import { GraphqlSubscriptionServer } from './graphql-subscription-server';
import { GraphqlWs } from './graphql-ws';
import { WebSocketServer } from 'ws';
import { Server } from 'http';
import { RedisClusterCache, RedisCache } from 'apollo-server-cache-redis';
import { IModuleService } from '../interfaces';
import { useServer } from 'graphql-ws/lib/use/ws';

interface WebSocketsCache {
    [key: string]: WebSocketServer;
}

interface MultiWebsocketConfig {
    [key: string]: any;
}
export class WebsocketMultiPathServer {
    private webSockets: WebSocketsCache = {};
    // private graphqlSubscriptionServer: GraphqlSubscriptionServer;
    private _graphqlWs: WebSocketServer;
    constructor(
        public moduleService: IModuleService,
        public cache: RedisCache | RedisClusterCache,
        multiplePathConfig?: MultiWebsocketConfig,
    ) {
        this._graphqlWs = new WebSocketServer({ noServer: true, path: __GRAPHQL_ENDPOINT__ });
        this.webSockets[__GRAPHQL_ENDPOINT__] = this._graphqlWs;
        this.webSockets[__GRAPHQL_ENDPOINT__].on('connection', (ws, request) => {
            console.log('--REQUESTED CONNECTION--', this._graphqlWs)
            useServer({
                schema: moduleService.schema,
            }, this._graphqlWs);
        });
    
        for (let key in multiplePathConfig) {
            if (!multiplePathConfig.hasOwnProperty(key)) {
                continue;
            }

            if (!this.webSockets[key]) {
                this.webSockets[key] = new WebSocketServer({ noServer: true });
                this.webSockets[key].on('connection', (ws, request) => {
                    Promise.all([
                        moduleService.createContext(request, null),
                        moduleService.serviceContext(request, null),

                    ]).then(multiplePathConfig[key](ws));
                });
            }
        }
    }

    public httpServerUpgrade(httpServer: Server) {
        httpServer.on('upgrade', (request, socket, head) => {
            const pathname = url.parse(request.url).pathname;
            console.log('--UPGRADE', request.url)

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

        // (new GraphqlWs(this.graphqlWs, this.moduleService, this.cache)).create();
        // useServer({
        //     schema: this.moduleService.schema,
        // }, this.graphqlWs);

        return httpServer;
    }

    public get graphqlWs() {
        return this._graphqlWs;
    }
    public close() {
        for (const key in this.webSockets) {
            this.webSockets[key].close();
        }
    }
}
