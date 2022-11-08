---
id: faq-build
title: Babel, JSX, and Build Steps
permalink: docs/faq-build.html
layout: docs
category: FAQ
---


### From where this `@sample-stack/platform-browser` comes  in `packages/sample-platform/browser/src/containers/Counter.tsx`?

We use [lerna](https://github.com/lerna/lerna) for monorepo. For example all packages starts with `@sample-stack` are either under `packages` or `pacakges-modules` directories.


### What is use of rehydrate?

It is used for SSR(server side rendering). Server generates initial browser page along with state(redux or apollo-client or css) and that state will be used in the browser to rehydated during browser rendering so the client state don't start from initial values.
