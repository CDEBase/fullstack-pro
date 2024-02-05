import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { Html } from './ssr/html';
import Helmet from 'react-helmet';
import path from 'path';
import fs from 'fs';
import { StaticRouter } from 'react-router';
import { logger } from '@cdm-logger/server';
import { ChunkExtractor } from '@loadable/server';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import createEmotionServer from '@emotion/server/create-instance';
import publicEnv from '../config/public-config';

let assetMap;
const key = 'custom';
const cache = createCache({ key });
const { extractCriticalToChunks, constructStyleTagsFromChunks } = createEmotionServer(cache);
export async function renderServerSideNoSSR(req, res) {
    try {
        let context: { pageNotFound?: boolean; url?: string } = { pageNotFound: false };
        const App = () => (
            <CacheProvider value={cache}>
                <StaticRouter location={req.url} context={context} />
            </CacheProvider>
        );
        if (context.pageNotFound === true) {
            res.status(404);
        } else {
            res.status(200);
        }
        const extractor = new ChunkExtractor({
            statsFile: path.resolve(__FRONTEND_BUILD_DIR__, 'loadable-stats.json'),
            entrypoints: ['index'],
            publicPath: !__DEV__ && __CDN_URL__ ? __CDN_URL__ : '/',
        });
        // Wrap your application using "collectChunks"
        const JSX = extractor.collectChunks(App());
        const content = ReactDOMServer.renderToString(JSX);

        const chunks = extractCriticalToChunks(JSX);

        const appStyles = constructStyleTagsFromChunks(chunks);
        // We need to tell Helmet to compute the right meta tags, title, and such.
        const helmet = Helmet.renderStatic(); // Avoid memory leak while tracking mounted instances
        if (context.url) {
            res.writeHead(301, { Location: context.url });
            res.end();
        } else {
            if (__DEV__ || !assetMap) {
                assetMap = JSON.parse(fs.readFileSync(path.join(__FRONTEND_BUILD_DIR__, 'assets.json')).toString());
            }
            const env = {
                ...publicEnv,
            };
            const page = (
                <Html
                    content={content}
                    state={{}}
                    assetMap={assetMap}
                    helmet={helmet}
                    extractor={extractor}
                    styleSheet={appStyles}
                    env={env}
                    reduxState={{}}
                    scriptsInserts={[]}
                    stylesInserts={[]}
                />
            );
            let pageContent = ReactDOMServer.renderToStaticMarkup(page);
            pageContent = pageContent.replace(/__STYLESHEET__/, '');
            res.status(200);
            res.send(`<!doctype html>\n${pageContent}`);
            res.end();
        }
    } catch (err) {
        logger.error('SERVER SIDE RENDER failed due to (%j) ', err.message);
        logger.debug(err);
    }
}