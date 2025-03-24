import express from 'express';
import compression from 'compression';
import { createRequestHandler } from '@remix-run/express';
import { installGlobals } from '@remix-run/node';
import './env.js';
import {
    performCopyOperations,
} from '@common-stack/rollup-vite-utils/lib/preStartup/configLoader/configLoader.js';
import config from './app/cde-webconfig.json' assert { type: 'json' };

installGlobals();

Object.keys(config.buildConfig).forEach((key) => {
    global[key] = config.buildConfig[key];
});

const startServer = async () => {
    await performCopyOperations(config);

    const { corsMiddleware } = await import(`./${config.commonPaths.appPath}/${config.commonPaths.frontendStackPath}/backend/middlewares/cors.js`);
    const { containerMiddleware } = await import(`./${config.commonPaths.appPath}/${config.commonPaths.frontendStackPath}/backend/middlewares/container.js`);
    const { loadContext } = await import(`./${config.commonPaths.appPath}/${config.commonPaths.frontendStackPath}/load-context.server.js`);

    const viteDevServer =
        process.env.NODE_ENV === 'production'
            ? undefined
            : await import('vite').then((vite) => {
                  return vite.createServer({
                      server: { middlewareMode: true },
                  });
              });

    const remixHandler = createRequestHandler({
        getLoadContext: loadContext,
        build: viteDevServer
            ? () => viteDevServer.ssrLoadModule('virtual:remix/server-build')
            : await import('./build/server/index.js'),
    });

    const app = express();

    app.use(compression());
    app.disable('x-powered-by');

    if (viteDevServer) {
        app.use(viteDevServer.middlewares);
    } else {
        app.use('/assets', express.static('build/client/assets', { immutable: true, maxAge: '1y' }));
    }

    app.use(express.static('build/client', { maxAge: '1h' }));

    app.use(corsMiddleware);
    app.options('*', corsMiddleware);

    app.use(async (req, res, next) => {
        let isAssetRequest = (url) =>
            /\.[jt]sx?$/.test(url) ||
            /@id\/__x00__virtual:/.test(url) ||
            /@vite\/client/.test(url) ||
            /node_modules\/vite\/dist\/client\/env/.test(url);

        if (isAssetRequest(req.url)) {
            next();
        } else {
            return await containerMiddleware(req, res, async () => {
                return remixHandler(req, res, next);
            });
        }
    });

    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Express server listening at http://localhost:${port}`));
};

startServer().catch((err) => {
    console.error('Failed to start server:', err);
});
