import React from "react";
import { Route } from "remix-json-routes";

export default (
  <Route path="/" file="exp/index.tsx">
    <Route path="demo" file="exp/demo/index.tsx">
      <Route path="counter" file="exp/demo/counter.tsx" />
      <Route path="counter/:num" file="exp/demo/counter.tsx" />
    </Route>
  </Route>
);
