import React from "react";

export const generateRemixRoutes = (route) => {
  route("/", "exp/index.tsx", () => {
    route("outer", "../node_modules/browser/lib/outer.tsx");
    route("demo", "exp/demo/index.tsx", () => {
      route("counter", "exp/demo/counter.tsx", { id: 'counter0' });
      route("counter/:num", "exp/demo/counter.tsx", { id: 'counter1' });
    });
  });
}
