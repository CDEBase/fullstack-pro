// import React from "react";
import outerModule from './outer.codegen';

export const generateRemixRoutes = async (route) => {
  
  route("/", "exp/index.tsx", () => {
    route("codegen", outerModule);
    route("demo", "exp/demo/index.tsx", () => {
      route("counter", "exp/demo/counter.tsx", { id: 'counter0' });
      route("counter/:num", "exp/demo/counter.tsx", { id: 'counter1' });
    });
  });
}
