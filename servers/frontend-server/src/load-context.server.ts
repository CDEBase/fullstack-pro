import 'reflect-metadata';
import { getRedisClient } from './config/redis-config.server';
import feature from './modules/module';

const routeConfig = feature.getConfiguredRoutes();
const redisClient = getRedisClient();
export const loadContext = async (req: Request, res: Response) => {
    const { container, store, apolloClient, services }: any = req;

    return {
        modules: feature,
        routeConfig,
        store,
        container,
        apolloClient,
        services,
        redisClient,
    };
};
