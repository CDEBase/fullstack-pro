import { Plugin } from 'vite';
import { getSortedRoutes } from '@common-stack/client-react/lib/route/get-routes.js';
import fs from 'fs';
import { isArray, mergeWith } from 'lodash-es';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import globAll from 'glob-all';

export interface Options {
  rootPath: string
  routesFileName?: string;
  folderName?: string
  /**
   * A list of package names under node_modules that will contain the locales directory
   * It can accept the glob value as well For Example packages: ['@dummy-package/*-browser']
   *
   * Default: 'locales'
   */
  packages: string[]
}

function getRootPath() {
  const directoryName = dirname(fileURLToPath(import.meta.url));
  const rootPath = directoryName.split('/node_modules')[0];
  return rootPath;
}

function resolvePathsUsingPackages(packages: string[], fileName: string, rootPath: string) {
  const basePath = rootPath || getRootPath();
  const folders = globAll.sync(
    packages.map((item) => {
      return `${basePath}/node_modules/${item}`;
    }),
  );
  const localesDirs = folders.reduce((acc: string[], curr: string) => {
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

function loadRoutesConfig(options: Options) {
  const fileName = options.routesFileName || 'route.json';
  const directories = resolvePathsUsingPackages(options.packages, fileName, options.rootPath);
  let content = [];
  directories.forEach((dir: string) => {
    const fileContent = String(fs.readFileSync(dir));
    const parsedContent = JSON.parse(fileContent);
    const mergedContent = mergeWith(content, parsedContent, customizer);
    if (mergedContent) {
      content = mergedContent;
    }
  });
  const result = content.length ? getSortedRoutes('/', Object.assign({}, ...content)) : null;
  const namedBundle = `export const routesConfiguration = ${JSON.stringify(result)}`
  return namedBundle;
}


export const virtualModuleId = 'virtual:routes-configuration'
export const resolvedVirtualModuleId = '\0' + virtualModuleId

const factory = (options: Options) => {
  const plugin: Plugin = {
    name: 'vite-plugin-route-configuration',
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
      return null
    },
    load(id) {
      if (id !== resolvedVirtualModuleId) {
        return null
      }
      const bundle = loadRoutesConfig(options)
      return bundle
    },
  }
  return plugin
}

export default factory