---
id: faq-build
title: Babel, JSX, and Build Steps
permalink: docs/faq-build.html
layout: docs
category: FAQ
---


### From where this `@sample-stack/client-state` comes  in `packages/sample-client-react/src/containers/Counter.tsx`?

We use [lerna](https://github.com/lerna/lerna) for monorepo. For example all packages starts with `@sample-stack` are either under `packages` or `pacakges-modules` directories.


### Why you have used [hot](https://github.com/cdmbase/fullstack-pro/blob/master/servers/frontend-server/src/app/Main.tsx#L3)?

It is used for `hot reloading`. Checkout out [React Hot Loader](https://github.com/gaearon/react-hot-loader)

### What is use of rehydrate?

It is used for SSR(server side rendering). Server generates initial browser page along with state(redux or apollo-client or css) and that state will be used in the browser to rehydated during browser rendering so the client state don't start from initial values.
