import { getSortedRoutes } from '@common-stack/client-react/lib/route/get-routes.js';
import fs from 'fs';
import globAll from 'glob-all';
import { isArray, mergeWith } from 'lodash-es';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuid } from 'uuid';

function getRootPath() {
    const directoryName = dirname(fileURLToPath(import.meta.url));
    const rootPath = directoryName.split('/node_modules')[0];
    return rootPath;
}

export function resolvePathsUsingPackages(packages, fileName, rootPath) {
    const basePath = rootPath || getRootPath();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const folders = globAll.sync(
        packages.map((item) => {
            return `${basePath}/node_modules/${item}`;
        }),
    );
    const localesDirs = folders.reduce((acc, curr) => {
        const dir = `${curr}/lib/${fileName}`;
        if (fs.existsSync(dir)) {
            return [...acc, dir];
        }
        return acc;
    }, []);
    return localesDirs;
}
function customizer(objValue, srcValue) {
    if (isArray(objValue)) {
        return objValue.concat(srcValue);
    }
}

export function loadRoutesConfig(options) {
    const fileName = options.routesFileName || 'route.json';
    const directories = resolvePathsUsingPackages(options.packages, fileName, options.rootPath);
    let content = [];
    directories.forEach((dir) => {
        const fileContent = String(fs.readFileSync(dir));
        const parsedContent = JSON.parse(fileContent);
        const mergedContent = mergeWith(content, parsedContent, customizer);
        if (mergedContent) {
            content = mergedContent;
        }
    });
    const result = content.length ? getSortedRoutes('/', Object.assign({}, ...content)) : null;
    return result;
}

export function jsonRoutes(defineRoutes, routes) {
    return defineRoutes((route) =>
        routes.forEach((r) => {
            return defineRoute(route, { ...r, path: r.relativePath });
        }),
    );
}

function defineRoute(routeFn, jsonRoute) {
    const { routes = null, relativePath: path, file: componentFile, ...rest } = jsonRoute;
    const rootPath = '../../..';
    let file = `${rootPath}/node_modules/${componentFile}`;
    let opts = { ...rest, id: uuid() };
    if (routes) {
        routeFn(path, file, opts, () => {
            routes.forEach((c) => defineRoute(routeFn, c));
        });
    } else {
        routeFn(path, file, opts);
    }
}

export function defineRoutesConfig(routeFn, options) {
    const jsonRoute = loadRoutesConfig(options);
    jsonRoute.forEach((item) => {
        defineRoute(routeFn, item);
    });
}
