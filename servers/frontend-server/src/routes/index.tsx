import pkg from '../../package.json' assert { type: "json" };
import { Feature, FeatureWithRouterFactory } from '@common-stack/client-react';
import { DefineRouteFunction } from '@remix-run/dev/dist/config/routes';
import counterModules from '@sample-stack/counter-module-browser';
import counterRoutes from '@sample-stack/counter-module-browser/lib/routes.json' assert { type: "json" };

const features = new Feature(FeatureWithRouterFactory, counterModules);
const configuredRoutes = features.getConfiguredRoutes2();
const allRoutes = [...counterRoutes];
const dependencies: any = pkg.dependencies;

const findRoute = (key: string) => {
  const found = allRoutes.find((r) => key === Object.keys(r)[0]);
  return found ? Object.values(found)[0] : null;
}

const genFilePath = (file: string, module: string) => {
  let link = dependencies[module];
  let filePath = file;
  
  if (link && link.startsWith('link:')) {
    link = link.replace('link:', '');
    filePath = filePath.replace(module, link);
    filePath = '../' + filePath; // escape from src/
  } else {
    filePath = '../node_modules/' + filePath; // escape from src/, enter node_modules/
  }
  return filePath;
};

const createRecursiveRoutes = (routes: [], route: DefineRouteFunction) => {
  routes.forEach((filteredRoute: any) => {
    const routeConfig = findRoute(filteredRoute['key']);
    
    if (routeConfig) {
      const { path, file, module, ...routeParams }: any = routeConfig;
      const filePath = genFilePath(file, module);

      route(path, filePath, routeParams, () => {
        if (Array.isArray(filteredRoute.routes) && filteredRoute.routes.length > 0) {
          createRecursiveRoutes(filteredRoute.routes, route);
        }
      });
    }
  });
}

export const generateRemixRoutes = async (route: DefineRouteFunction) => {
  createRecursiveRoutes(configuredRoutes, route);
}
