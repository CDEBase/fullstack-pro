import { RedisClusterCache, RedisCache } from 'apollo-server-cache-redis';
import { CdmLogger } from '@cdm-logger/core';
import { IModuleService } from '../interfaces';

type ILogger = CdmLogger.ILogger;

// @workaround as the `dataSources` not available in Subscription (websocket) Context.
// https://github.com/apollographql/apollo-server/issues/1526 need to revisit in Apollo-Server v3.
const constructDataSourcesForSubscriptions = (context, cache, dataSources) => {
    const intializeDataSource = (instance) => {
        instance.initialize({ context, cache });
    };
    // tslint:disable-next-line:forin
    for (const prop in dataSources) {
        // tslint:disable-next-line:no-console
        intializeDataSource(dataSources[prop]);
    }
    return dataSources;
};

/**
 * It'll get messy below but there's an issue currently with the state of the protocols that can be used (subscriptions-transport-ws vs graphql-ws).
 * Read more from: https://www.apollographql.com/docs/apollo-server/data/subscriptions/#the-graphql-ws-transport-library
 *
 * Bottomline is, if we use the newer and actively maintained `graphql-ws` lib, then the GraphQL Playground will not work because it uses the old protocol.
 *
 * The approach below tries to support both based on the template provided here but adjusted for our setup here.
 * https://github.com/enisdenjo/graphql-ws#ws-backwards-compat
 */

export async function createContextFromConnectionParams(
    connectionParams: any,
    webSocket: any,
    moduleService: IModuleService,
    cache: RedisCache,
    logger: ILogger,
): Promise<any> {
    logger.debug(`Subscription client connected using built-in SubscriptionServer.`);
    const pureContext = await moduleService.createContext(connectionParams, webSocket);
    const contextServices = await moduleService.serviceContext(connectionParams, webSocket);
    const context = {
        ...contextServices,
        ...pureContext,
        preferences: moduleService.defaultPreferences,
        // update: updateContainers,
        // wsCtx: ctx,
    };
    const addons = {
        dataSources: constructDataSourcesForSubscriptions(context, cache, moduleService.dataSource),
    };
    return {
        ...context,
        ...addons,
    };
}
