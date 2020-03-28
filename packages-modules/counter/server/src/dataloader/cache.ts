import * as DataLoader from 'dataloader';
import { KeyValueCache } from 'apollo-server-caching';
import { config } from '../config';
import { logger } from '@cdm-logger/server';



export const setupCaching
    = ({ textFileService, cache }: { textFileService: ICustomTextFileService, cache: KeyValueCache<ITextFileContent> }) => {
        const loader = new DataLoader<URI, ITextFileContent>((resources) => {
            return textFileService.read(resources[0])
                .then(data => [data]);
        }, { batch: false });
        let cachedTextFileService: ICacheTextFileService = {};
        cachedTextFileService.readCache = async (resource, options) => {
            // stores as file:///tmp/tmp.txt
            const key = URI.from(resource).toString();
           
            const cacheDoc = await cache.get(key);
            console.log('---CACHE_-', cacheDoc);
            if (cacheDoc) {
                logger.trace('  document pulled from cache, [%s]', JSON.stringify(cacheDoc));
                console.log(JSON.stringify(cacheDoc.toString()))

                if (cacheDoc.etag === options.etag) {
                    return cacheDoc;
                } else {
                    console.warn('Files cache is found but etag do not match');
                }
            }
            try {
                const doc = await loader.load(resource);
                console.log('resolveContent:>>>', { cacheDoc, doc });

                // https://github.com/apollographql/apollo-server/tree/master/packages/apollo-server-caching#apollo-server-caching
                cache.set(key, doc, { ttl: config.FILES_TTL });
                return doc;
            } catch (e) {
                console.log('error: ', e);
                return null;
            }
        };

        cachedTextFileService.writeCache = (resource, value, options) => {
            const key = URI.from(resource).toString();
            cache.delete(key);
            return textFileService.write(resource, value, options);
        };

        cachedTextFileService.deleteCache = (resource, options) => {
            const key = URI.from(resource).toString();
            cache.delete(key);
            return textFileService.delete(resource, options);
        };

        return cachedTextFileService;
    };
