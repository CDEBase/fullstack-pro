import { createRequestHandler } from '@remix-run/express';
import { installGlobals } from '@remix-run/node';
import compression from 'compression';
import express from 'express';
import config from './build.config.mjs';

installGlobals();

Object.keys(config).forEach((key) => {
    global[key] = config[key];
});

const { corsMiddleware } = await import('./src/backend/middlewares/cors');
// const { errorMiddleware } = await import('./src/backend/middlewares/error');
const { containerMiddleware } = await import('./src/backend/middlewares/container');

const modules = await import('./src/backend/modules');

const viteDevServer =
    process.env.NODE_ENV === 'production'
        ? undefined
        : await import('vite').then((vite) =>
              vite.createServer({
                  server: { middlewareMode: true },
              }),
          );

const remixHandler = createRequestHandler({
    async getLoadContext(req, res) {
        // Object.keys(config).forEach((key) => {
        //     global[key] = config[key];
        // });

        const { loadContext } = await import('./src/load-context.server.ts');
        return loadContext(req, res);
    },
    build: viteDevServer
        ? () => viteDevServer.ssrLoadModule('virtual:remix/server-build')
        : await import('./build/server/index.js'),
});

const app = express();

app.use(compression());

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable('x-powered-by');

// handle asset requests
if (viteDevServer) {
    app.use(viteDevServer.middlewares);
} else {
    // Vite fingerprints its assets so we can cache forever.
    app.use('/assets', express.static('build/client/assets', { immutable: true, maxAge: '1y' }));
}

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(express.static('build/client', { maxAge: '1h' }));

app.use(corsMiddleware);
app.options('*', corsMiddleware);
// app.use(cookiesMiddleware);
// app.use(containerMiddleware);

app.use(async (req, res, next) => {
    let isAssetRequest = (url: string) =>
        /\.[jt]sx?/.test(url) ||
        /@id\/__x00__virtual:/.test(url) ||
        /@vite\/client/.test(url) ||
        /node_modules\/vite\/dist\/client\/env/.test(url);
    // console.log(req.url);
    if (isAssetRequest(req.url)) {
        next();
    } else {
        return await containerMiddleware(req, res, async () => {
            if (modules.default.beforewares.length > 0) {
                console.log('---MODULES BEFOREWARE');
                await Promise.allSettled(
                    modules.default.beforewares.map((beforeware) => {
                        console.time(`Execution Time for ${beforeware.name}`);
                        return beforeware(req, res, () => {}).finally(() =>
                            console.timeEnd(`Execution Time for ${beforeware.name}`),
                        );
                    }),
                );

                console.log('---MODULES BEFOREWARE DONE');
            }

            // handle SSR requests
            return remixHandler(req, res, next);
        });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Express server listening at http://localhost:${port}`));
