// cache.ts
import { InMemoryCache } from '@apollo/client/cache';
import { CdmLogger } from '@cdm-logger/core';

interface CreateCacheParams {
    getDataIdFromObject: (x?: any) => string;
    clientState: any; // Replace `any` with the actual type if known
    initialState?: any;
    logger: CdmLogger.ILogger;
}

export const createCache = ({ getDataIdFromObject, clientState }: CreateCacheParams): InMemoryCache => {
    const cache = new InMemoryCache({
        dataIdFromObject: getDataIdFromObject,
        possibleTypes: clientState.possibleTypes,
        typePolicies: clientState.typePolicies,
    });

    return cache;
};

export const initializeCache = ({ cache, initialState, clientState, logger }: { cache: InMemoryCache, initialState?: any, clientState: any, logger: CdmLogger.ILogger }) => {
    if (initialState) {
        try {
            cache.restore(initialState);
            logger.debug('Cache restored with initial state');
        } catch (err) {
            logger.error('Error restoring cache', err);
        }
    } else {
        clientState.defaults?.forEach((x) => {
            try {
                if (x.type === 'query') {
                    cache.writeQuery({ query: x.query, data: x.data });
                } else if (x.type === 'fragment') {
                    cache.writeFragment({ id: x.id, fragment: x.fragment, data: x.data });
                }
            } catch (err) {
                logger.error('Error writing to cache', err);
            }
        });
    }
};
