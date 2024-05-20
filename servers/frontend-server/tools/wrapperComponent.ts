import * as fs from 'fs';
import * as path from 'path';
import { IOptions } from './types';

const permissionWrapperImportPath = '@adminide-stack/platform-browser/lib/components/Permission/WithPermission.js';
const authMiddlwarePath = '@adminide-stack/user-auth0-client/lib/auth/authValidatorMiddleware.js';
const lifecyclePath = '@adminide-stack/platform-client/lib/middleware/lifecycleMiddleware.js';
const middleWareExecPath = '../tools/loaderWithMiddleware.js';

// Utility function to get the project's root directory.
export function getRootPath(): string {
    return process.cwd();
}

// New function to handle file writing
function writeComponentToFile(filePath, content) {
    fs.writeFileSync(filePath, content, 'utf8');
}

function generateExports(options: IOptions) {
    let exports = '';
    const hasMiddleware = options.requireAuth || options.middlewares.length > 0 || options.authority.length > 0;
    if (hasMiddleware || options.hasLoader) {
        exports += `
export async function loader(params) {
  ${hasMiddleware ? 'const middlewareStack = [];' : ''}
  ${options.requireAuth ? 'middlewareStack.push({ name: "auth", func: authMiddleware });' : ''}
  ${generateMiddlewarePushes(options)}
  ${
      options.authority?.length > 0
          ? 'middlewareStack.push({ name: "lifecycle", func: lifecycleMiddleware });\n' +
            '  middlewareStack.push({ name: "permission", func: permissionMiddleware });\n'
          : ''
  }
  ${
      hasMiddleware
          ? 'let middlewareData = {};\n' +
            '  if (middlewareStack.length > 0) {\n' +
            '    middlewareData = await loaderWithMiddleware(params, middlewareStack) || {};\n' +
            '  }\n' +
            '  const { permissions = null, ...rest } = middlewareData;\n'
          : ''
  }
  let hasPermissions = true
  ${generateHasPermission(options)} 
  ${options.hasLoader ? `let loaderData = hasPermissions && await loaderFunc(params) || [];\n` : ''}
  ${generateDeferredLogic(options)}
  ${
      options.loaderDeferKeys && options.loaderDeferKeys.length > 0
          ? `return defer({ ...deferredObjects , ...${hasMiddleware ? `{ permissions, dataContext: rest }` : `{}`}});`
          : `
              ${
                  options.hasLoader && !hasMiddleware
                      ? 'return loaderData;'
                      : `return { 
                        ${options.hasLoader ? '...loaderData, ' : ''}
              ${hasMiddleware ? 'permissions, dataContext: rest' : ''}
              };`
              }`
  }
}`;
    }

    if (options.hasAction) {
        exports += `
export async function action(params) {
  return await actionFunc(params);
}
`;
    }

    if (options.hasClientLoader) {
        exports += `
export async function clientLoader(params) {
  return await clientLoaderFunc(params);
}
clientLoader.hydrate = true;
`;
    }

    if (options.hasClientAction) {
        exports += `
export async function clientAction(params) {
  return await clientActionFunc(params);
}
`;
    }

    if (options.hasHandle) {
        exports += `
export const handle = handleObj
`;
    }

    if (options.hasLinks) {
        exports += `
export function links(params) {
  return linksFunc(params);
}
`;
    }

    if (options.hasMeta) {
        exports += `
export function meta(params) {
  return metaFunc(params);
}
`;
    }

    if (options.hasShouldRevalidate) {
        exports += `
export function shouldRevalidate(params) {
  return shouldRevalidateFunc(params);
}
`;
    }

    if (options.hasHeaders) {
        exports += `
export function headers(params) {
  return headersFunc(params);
}
`;
    }

    if (options.hasHydrateFallback) {
        exports += `
export function HydrateFallback(params) {
  return HydrateFallbackFunc(params);
}
`;
    }

    if (options.hasErrorBoundary) {
        exports += `
export function ErrorBoundary(params) {
  return ErrorBoundaryFunc(params);
}
`;
    }

    return exports;
}

function generateMiddlewarePushes(options: IOptions): string {
    return options.middlewares
        .map((_, index) => `middlewareStack.push({ name: "middleware${index + 1}", func: middleware${index + 1} });`)
        .join('\n  ');
}
function generateHasPermission(options: IOptions): string {
    if (options.authority?.length > 0 && options.hasLoader) {
        return `
  if (permissions !== null) {
    // Filter permissions based on authority keys
    const permissionKeys = ${JSON.stringify(options.authority)};
    hasPermissions = permissionKeys.some(key => ['Allow'].includes(get(permissions?.resolveConfiguration, key)));
  }
`;
    }
    return '';
}

function generateDeferredLogic(options: IOptions): string {
    if (options.loaderDeferKeys?.length > 0) {
        // Create deferred objects by directly assigning each key to its corresponding index in loaderData
        const deferredAssignments = options.loaderDeferKeys
            .map((key, index) => `    deferredObjects['${key}'] = loaderData[${index}];`)
            .join('\n  ');

        return `
  const deferredObjects = {};
  if (hasPermissions) {
${deferredAssignments}
  }
        `;
    }
    return '';
}

function generateLoaderDataHook(options: IOptions) {
    if (options.hasClientLoader || options.hasLoader || options.authority.length > 0) {
        return `const loaderData = useLoaderData();\n`;
    }
    return '';
}

function generateLoaderDataProp(options: IOptions) {
    if (options.hasClientLoader || options.hasLoader || options.authority.length > 0) {
        return 'loaderData={loaderData}';
    }
    return '';
}

function wrapComponent(currentFilePath, wrapperPaths, options: IOptions) {
    let imports = `import * as React from 'react';\n`;
    let componentImports = ``;

    const additionalImports = [];
    if (options.hasLoader) additionalImports.push('loader as loaderFunc');
    if (options.hasAction) additionalImports.push('action as actionFunc');
    if (options.hasClientLoader) additionalImports.push('clientLoader as clientLoaderFunc');
    if (options.hasClientAction) additionalImports.push('clientAction as clientActionFunc');
    if (options.hasHandle) additionalImports.push('handle as handleObj');
    if (options.hasLinks) additionalImports.push('links as linksFunc');
    if (options.hasMeta) additionalImports.push('meta as metaFunc');
    if (options.hasShouldRevalidate) additionalImports.push('shouldRevalidate as shouldRevalidateFunc');
    if (options.hasHeaders) additionalImports.push('headers as headersFunc');
    if (options.hasHydrateFallback) additionalImports.push('HydrateFallback as HydrateFallbackFunc');
    if (options.hasErrorBoundary) additionalImports.push('ErrorBoundary as ErrorBoundaryFunc');
    if (additionalImports.length > 0 || options.hasComponent) {
        let namedImports = additionalImports.join(', ');
        // Determine how to construct the import statement based on whether there are named imports and a default import
        componentImports += `import ${options.hasComponent ? 'OriginalComponent' + (namedImports ? ', ' : '') : ''}${
            namedImports ? `{ ${namedImports} }` : ''
        } from '${currentFilePath}';\n`;
    }
    imports += componentImports;

    if (options.hasComponent && (options.hasClientLoader || options.hasLoader || options.authority.length > 0)) {
        imports += `import { useLoaderData } from '@remix-run/react';\n`;
    }
    if (options.loaderDeferKeys) {
        imports += `import { defer } from '@remix-run/react';\n`;
    }

    if (options.requireAuth) {
        imports += `import { middleware as authMiddleware } from '${authMiddlwarePath}';\n`;
    }

    if (options.authority.length > 0) {
        imports += `import { middleware as lifecycleMiddleware } from '${lifecyclePath}';\nimport { get } from 'lodash-es';\n`;
    }

    if (options.requireAuth || options.authority.length > 0 || options.middlewares.length > 0) {
        imports += `import { loaderWithMiddleware } from '${middleWareExecPath}';\n`;
    }
    // Construct imports for additional custom middleware
    // Dynamically import middleware with incremented names
    if (options.middlewares) {
        options.middlewares.forEach((middlewarePath, index) => {
            imports += `import { middleware as middleware${index + 1} } from '${middlewarePath}';\n`;
        });
    }
    let componentLogic = ``;
    if (options.hasComponent) {
        let wrappersStart = '',
            wrappersEnd = '';
        wrapperPaths.forEach((wrapperPath, index) => {
            const wrapperComponentName = `Wrapper${index + 1}`;
            if (wrapperPath === '$permissionWrapper') {
                imports += `import { WithPermissionBehaviour, WithPermissionContainer, middleware as permissionMiddleware } from '${permissionWrapperImportPath}';\n`;
                wrappersStart = `<WithPermissionContainer behaviour={WithPermissionBehaviour.showUnAuthorized} permissionKeys={${JSON.stringify(
                    options.authority,
                )}} permissions={props.loaderData.permissions}>${wrappersStart}`;
                wrappersEnd += `</WithPermissionContainer>`;
            } else if (wrapperPath === '$clientOnlyWrapper') {
                imports += `import { ClientOnly } from 'remix-utils/client-only';\n`;
                wrappersStart = `<ClientOnly>${wrappersStart}`;
                wrappersEnd += `</ClientOnly>`;
            } else {
                imports += `import ${wrapperComponentName} from '${wrapperPath}';\n`;
                wrappersStart += `<${wrapperComponentName} {...props}>`;
                wrappersEnd = `</${wrapperComponentName}>${wrappersEnd}`;
            }
        });
        componentLogic = `
        const EnhancedComponent = (props) => {
          return ${wrappersStart}<OriginalComponent {...props} />${wrappersEnd};
        };
        export default function Component(ownProps) {
          ${generateLoaderDataHook(options)}
          const props = {...ownProps, ...${JSON.stringify(options.extraProps)}};
          return <EnhancedComponent {...props} ${generateLoaderDataProp(options)} />;
        }
        
        `;
    }

    componentLogic = componentLogic + `${generateExports(options)}`;
    return imports + componentLogic;
}

export function wrapRouteComponent(
    file: string,
    wrapperPaths: string[] = [],
    options = {
        requireAuth: false,
        hasLoader: false,
        hasAction: false,
        hasClientLoader: false,
        hasClientAction: false,
        middlewares: [],
        suffix: '',
        authority: [],
        extraProps: {},
    } as any,
): string {
    const basePath = path.join(getRootPath(), 'node-modules');
    let fileName = path.basename(file, '.js');
    fileName = `Wrapped${fileName}-${options.suffix}.tsx`;
    const newFilePath = path.join(getRootPath(), 'app', fileName);
    const wrappedContent = wrapComponent(file, wrapperPaths, options);

    writeComponentToFile(newFilePath, wrappedContent);
    return path.relative(basePath, newFilePath);
}
