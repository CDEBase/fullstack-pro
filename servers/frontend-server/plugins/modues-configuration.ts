import { Plugin } from 'vite'
import { Feature } from '@common-stack/client-react';
import fs from 'fs';

export interface Options {
  modulePaths: string[]
}

async function loadModuleFromPaths(options: Options) {
  const paths = options.modulePaths
  const rootPath = '../../node_modules'
  const modules = paths.map((item) => {
    return `${rootPath}/${item}`;
  })
    .filter((path) => {
      if (!fs.existsSync(path)) {
        console.warn("PATH DOES'NT EXIST", path)
        return false;
      }
      return true;
    })
    .map((path) => {
      return import(path).then((module) => module.default)
    })

  const resolvedModules = modules?.length ? await Promise.all(modules) : []
  const feature = resolvedModules?.length ? new Feature(...resolvedModules) : {}
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