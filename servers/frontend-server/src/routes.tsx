import React from "react";
import { Route } from "remix-json-routes";

export default (
  <Route path="/" file="exp/index.tsx">
  <Route path="demo" file="exp/demo/index.tsx">
    <Route path="counter" file="exp/demo/counter.tsx" />
    <Route path="counter/:num" file="exp/demo/counter.tsx" />
  </Route>
</Route>
  // <Route path="/" file="../../../node_modules/@sample-stack/counter-module-browser/lib/common/layout/components/SideMenu.js">
  //   <Route path="apollo-server-n-client" file="../../../node_modules/@sample-stack/counter-module-browser/lib/common/components/Dashboard.js">
  //     <Route path="counter" file="../../../node_modules/@sample-stack/counter-module-browser/lib/apollo-server-n-client/containers/Counter.js" />
  //   </Route>
  //   <Route path="emotion" file="../../../node_modules/@sample-stack/counter-module-browser/lib/emotion/components/CompledWithTheme.js" />
  //   <Route path="redux-first-history/counter" file="../../../node_modules/@sample-stack/counter-module-browser/lib/redux-first-history/components/Counter.js" />
  //   <Route path="redux-first-history/hello" file="../../../node_modules/@sample-stack/counter-module-browser/lib/redux-first-history/components/Hello.js" />
  // </Route>
);


// <Route path="/" file="exp/index.tsx">
//   <Route path="demo" file="exp/demo/index.tsx">
//     <Route path="counter" file="exp/demo/counter.tsx" />
//     <Route path="counter/:num" file="exp/demo/counter.tsx" />
//   </Route>
//   <Route path="/emotion" file="../../../node_modules/@sample-stack/counter-module-browser/lib/emotion/components/CompledWithTheme.js" />
//   <Route path="/redux-first-history/counter" file="../../../node_modules/@sample-stack/counter-module-browser/lib/redux-first-history/components/Counter.js" />
// </Route>