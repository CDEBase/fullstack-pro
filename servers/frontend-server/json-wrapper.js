import { getSortedRoutes } from '@common-stack/client-react/lib/route/get-routes.js';
import fs from 'fs';
import globAll from 'glob-all';
import _ from 'lodash';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuid } from 'uuid';


function getRootPath() {
    const directoryName = dirname(fileURLToPath(import.meta.url));
    console.log('---diretocrtoryName', directoryName);
    const rootPath = directoryName.split('/node_modules')[0];
    return rootPath;
}

export function resolvePathsUsingPackages(packages, fileName, rootPath) {
    console.log('---PACKGAGE', packages, rootPath);
    const basePath = rootPath || getRootPath();
    console.log('--BBBBB', basePath);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const folders = globAll.sync(
        packages.map((item) => {
            console.log('test---', `${basePath}/node_modules/${item}`);

            return `${basePath}/node_modules/${item}`;
        }),
    );
    console.log('---folders', folders);
    const localesDirs = folders.reduce((acc, curr) => {
        const dir = `${curr}/lib/${fileName}`;
        if (fs.existsSync(dir)) {
            return [...acc, dir];
        }
        return acc;
    }, []);
    console.log('-_LOCALES DIRS', localesDirs);
    return localesDirs;
}
function customizer(objValue, srcValue) {
    if (_.isArray(objValue)) {
        return objValue.concat(srcValue);
    }
}

export function loadRoutesConfig(options) {
    const fileName = options.routesFileName || 'route.json';
    console.log('--OPTIONS---', options);
    const directories = resolvePathsUsingPackages(options.packages, fileName, options.rootPath);
    console.log('---directories', directories);
    let content = [];
    directories.forEach((dir) => {
        console.log('--_DIR SEA', dir);
        const fileContent = String(fs.readFileSync(dir));
        const parsedContent = JSON.parse(fileContent);
        const mergedContent = _.mergeWith(content, parsedContent, customizer);
        if (mergedContent) {
            content = mergedContent;
        }
    });
    const result = content.length ? getSortedRoutes('/', Object.assign({}, ...content)) : null;
    console.log('--_RESULT----json', JSON.stringify(result));
    return result;
}

export function jsonRoutes(defineRoutes, routes) {
    return defineRoutes((route) => routes.forEach((r) => defineRoute(route, r)));
}


function defineRoute(routeFn, jsonRoute) {
    const { routes = null, path, file: componentFile, ...rest } = jsonRoute;
    console.log('---GIVEN JSON ---', jsonRoute)
    const fileRootPath = getRootPath();
    const rootPath = '../../..' 
    let file = `${rootPath}/node_modules/${componentFile}`
    console.log('---FILE-', file);
    let opts = { ...rest, id: uuid()};
    console.log(`
    --------------
    file: ${file}
    path: ${path}
    opts: ${JSON.stringify(opts)}
    ----------------
    `)
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
    console.log('----JSON ROUTE', jsonRoute)
    jsonRoute.forEach((item) => {
        defineRoute(routeFn, item);
    })
}
