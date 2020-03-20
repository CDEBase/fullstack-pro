
import { SubscriptionServer, ConnectionContext } from 'subscriptions-transport-ws';
import { execute, subscribe, GraphQLSchema } from 'graphql';
import { Server } from 'http';
import * as ILogger from 'bunyan';
import { IModuleService } from '../interfaces';

export class GraphqlSubscriptionServer {

    private subscriptionServer: SubscriptionServer;
    private logger: ILogger;
    constructor(
        private moduleService: IModuleService,
        ) {

        this.logger = this.moduleService.logger.child({ className: 'GraphqlSubscriptionServer' });
    }

    public create() {
        this.subscriptionServer = SubscriptionServer.create(
            {
                schema: this.moduleService.schema,
                execute,
                onConnect: async (connectionParams: any, webSocket: any, ctx: ConnectionContext) => {
                    try {
                        this.logger.debug(`Subscription client connected using built-in SubscriptionServer.`);
                        const pureContext = await this.moduleService.createContext(connectionParams, webSocket);
                        const contextServices = await this.moduleService.serviceContext(connectionParams, webSocket);
                        console.log('---pureContext', pureContext);
                        console.log('---contexService', contextServices);
                        return {
                            ...contextServices,
                            ...pureContext,
                            preferences: this.moduleService.defaultPreferences,
                            // update: updateContainers,
                            wsCtx: ctx,
                        };
                    } catch (e) {
                        this.logger.error(e);
                    }
                },
                onOperation: async (message: any, params: any, webSocket: any) => {
                    try {
                        params.context = await this.moduleService.createContext(null, null, message.payload, webSocket);
                        return params;
                    } catch (e) {
                        this.logger.error(e);
                    }
                },
            }, {
            noServer: true,
        },
        );
        return this.subscriptionServer;
    }

    public disconnect() {
        if (this.subscriptionServer) {
            this.subscriptionServer.close();
        }
    }
}
