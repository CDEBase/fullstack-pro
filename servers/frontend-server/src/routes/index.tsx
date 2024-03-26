import React from "react";
import counterModules from '@sample-stack/counter-module-browser/lib/apollo-server-n-client/compute.route.json';

export const generateRemixRoutes = async (route) => {
  route("/", "exp/index.tsx", () => {
    // route("codegen", outerModule);
    route("demo", "exp/demo/index.tsx", () => {
      route("ex", "exp/demo/counter.tsx", { id: 'ex0' });
      route("ex/:num", "exp/demo/counter.tsx", { id: 'ex1' });
    });
    
    counterModules.forEach(({ path, file, key, ...routeConfig }: any, k: number) => {
      if (file) {
        route(path, `../node_modules/${file}`, { id: `${key ?? 'counter'}${k}`, ...routeConfig });
      }
    });
  });
}
