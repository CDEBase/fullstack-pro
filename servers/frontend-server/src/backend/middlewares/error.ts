/// <reference path='../../../../../typings/index.d.ts' />

import * as path from 'path';
import * as fs from 'fs';
import * as url from 'url';
import { logger } from '@cdm-logger/server';


let assetMap;

const stripCircular = (from, seen?: any) => {
    const to = Array.isArray(from) ? [] : {};
    seen = seen || [];
    seen.push(from);
    Object.getOwnPropertyNames(from).forEach(key => {
        if (!from[key] || (typeof from[key] !== 'object' && !Array.isArray(from[key]))) {
            to[key] = from[key];
        } else if (seen.indexOf(from[key]) < 0) {
            to[key] = stripCircular(from[key], seen.slice(0));
        } else { to[key] = '[Circular]'; }
    });
    return to;
};

const { pathname } = url.parse(__BACKEND_URL__);

export const errorMiddleware =
    (e, req, res, next) => {
        if (req.path === pathname) {
            const stack = e.stack.toString().replace(/[\n]/g, '\\n');
            res.status(200).send(`[{"data": {}, "errors":[{"message": "${stack}"}]}]`);
        } else {
            logger.error(e);

            if (__DEV__ || !assetMap) {
                assetMap = JSON.parse(fs.readFileSync(path.join(__FRONTEND_BUILD_DIR__, 'assets.json')).toString());
            }

            const serverErrorScript = `<script charset="UTF-8">window.__SERVER_ERROR__=${JSON.stringify(
                stripCircular(e),
            )};</script>`;
            const vendorScript = assetMap['vendor.js']
                ? `<script src="/${assetMap['vendor.js']}" charSet="utf-8"></script>`
                : '';

            res.status(200).send(
                `<html>${serverErrorScript}<body><div id="content"></div>
        ${vendorScript}
            <script src="/${assetMap['index.js']}" charSet="utf-8"></script>
            </body></html>`,
            );
        }
    };


