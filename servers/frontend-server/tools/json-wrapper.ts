import { getSortedRoutes } from '@common-stack/client-react/lib/route/get-routes.js';
import fs from 'fs';
import globAll from 'glob-all';
import { isArray, mergeWith } from 'lodash-es';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { createHash } from "node:crypto";
import { wrapRouteComponent } from './wrapperComponent';

function getRootPath() {
    const directoryName = dirname(fileURLToPath(import.meta.url));
    const rootPath = directoryName.split('/node_modules')[0];
    return rootPath;
}

const getHash = (source: string, maxLength: number = 8): string => {
    let hash = createHash("sha256").update(source).digest("hex");
    return typeof maxLength === "number" ? hash.slice(0, maxLength) : hash;
};

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

// export function jsonRoutes(defineRoutes, routes) {
//     return defineRoutes((route) =>
//         routes.forEach((r) => {
//             return defineRoute(route, r);
//         }),
//     );
// }

function defineRoute(routeFn, jsonRoute) {
    const {
        routes = null,
        relativePath: path,
        componentPath,
        clientOnly,
        auth,
        loader = false,
        action = false,
        wrapperPaths = [],
        ...rest
    } = jsonRoute;

    // let file = `${rootPath}/node_modules/${componentFile}`;
    if (componentPath) {
        // Modify wrapperPaths array conditionally based on auth and clientOnly
        if (auth) {
            wrapperPaths.push('$authWrapper'); // Add a placeholder for the auth wrapper
        }
        if (clientOnly) {
            wrapperPaths.push('$clientOnlyWrapper'); // Add a placeholder for the client-only wrapper
        }

        const options = { hasLoader: loader, hasAction: action, suffix: getHash(rest.path || '/') };
        const file = wrapRouteComponent(componentPath, wrapperPaths, options);
        const opts = { ...rest, id: rest.path };
        if (routes) {
            routeFn(path, file, opts, () => {
                routes.forEach((c) => defineRoute(routeFn, c));
            });
        } else {
            routeFn(path, file, opts);
        }
    }
}

export function defineRoutesConfig(routeFn, options) {
    const jsonRoute = loadRoutesConfig(options);
    jsonRoute.forEach((item) => {
        defineRoute(routeFn, item);
    });
}