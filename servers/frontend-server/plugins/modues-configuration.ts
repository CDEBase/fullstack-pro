import { Plugin } from 'vite'
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { Feature } from '@common-stack/client-react';

export interface Options {
  modulePaths: string[]
}

async function loadModuleFromPaths(options: Options) {
  const paths = options.modulePaths
  const directoryName = dirname(fileURLToPath(import.meta.url));
  const rootPath = directoryName.split('/node_modules')[0];
  const modules = paths.map((item) => {
    return `${rootPath}/node_modules/${item}`;
  }).map((path) => {
    return import(path)
  })
  const resolvedModules = await Promise.all(modules)
  const feature = new Feature(...resolvedModules)
  const namedBundle = `export const moduleConfiguration = ${JSON.stringify(feature)}`
  return namedBundle;
}


export const virtualModuleId = 'virtual:cdm-modules'
export const resolvedVirtualModuleId = '\0' + virtualModuleId

const factory = (options: Options) => {
  const plugin: Plugin = {
    name: 'vite-plugin-module-configuration',
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
      return null
    },
    async load(id) {
      if (id !== resolvedVirtualModuleId) {
        return null
      }
      const bundle = await loadModuleFromPaths(options)
      return bundle
    },
  }
  return plugin
}

export default factory