import { Feature, FeatureWithRouterFactory } from '@common-stack/client-react';
import { DefineRouteFunction } from '@remix-run/dev/dist/config/routes';
import counterModules from '@sample-stack/counter-module-browser';
// import counterRoutes from '@sample-stack/counter-module-browser/lib/routes.json' assert { type: "json" };
import { wrapRouteComponent } from './wrapRoutes';

const features = new Feature(FeatureWithRouterFactory, counterModules);
const configuredRoutes = features.getConfiguredRoutes2();
// const allRoutes = [...counterRoutes];
// const dependencies: any = pkg.dependencies;

// const findRoute = (key: string) => {
//   const found = allRoutes.find((r) => key === Object.keys(r)[0]);
//   return found ? Object.values(found)[0] : null;
// }

const genFilePath = (file: string) => {
  return `../../../node_modules/${file}`; // servers/frontend-server/src
};

const createRecursiveRoutes = (routes: [], route: DefineRouteFunction) => {
  routes.forEach((filteredRoute: any) => {
    console.log('--- FILDTER ---', filteredRoute);
    const routeConfig = filteredRoute;
    
    if (routeConfig) {
      const { path, file, ...routeParams } = routeConfig;
      let filePath = file;
      if (routeParams.auth === true) {
        filePath = wrapRouteComponent(filePath);
      }
      filePath = genFilePath(filePath);

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
