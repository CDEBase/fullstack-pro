import * as React from 'react';

import { merge, map, union, without, castArray } from 'lodash';

const combine = (features, extractor) => without(union(...map(features, res => castArray(extractor(res)))), undefined);

export const featureCatalog = {};

export default class {
    private route;
    private navItem;
    private navItemRight;
    private reducer;
    private resolver;
    private middleware;
    private afterware;
    private connectionParam;
    private createFetchOptions;
    private stylesInsert;
    private scriptsInsert;
    private rootComponentFactory;
    private routerFactory;

  /* eslint-disable no-unused-vars */
  constructor(
    {
      route,
      navItem,
      navItemRight,
      reducer,
      resolver,
      middleware,
      afterware,
      connectionParam,
      createFetchOptions,
      stylesInsert,
      scriptsInsert,
      rootComponentFactory,
      routerFactory,
      catalogInfo,
    },
    ...features,
  ) {
    /* eslint-enable no-unused-vars */
    combine(arguments, arg => arg.catalogInfo).forEach(info =>
      Object.keys(info).forEach(key => (featureCatalog[key] = info[key]))
    );
    this.route = combine(arguments, arg => arg.route);
    this.navItem = combine(arguments, arg => arg.navItem);
    this.navItemRight = combine(arguments, arg => arg.navItemRight);
    this.reducer = combine(arguments, arg => arg.reducer);
    this.resolver = combine(arguments, arg => arg.resolver);
    this.middleware = combine(arguments, arg => arg.middleware);
    this.afterware = combine(arguments, arg => arg.afterware);
    this.connectionParam = combine(arguments, arg => arg.connectionParam);
    this.createFetchOptions = combine(arguments, arg => arg.createFetchOptions);
    this.stylesInsert = combine(arguments, arg => arg.stylesInsert);
    this.scriptsInsert = combine(arguments, arg => arg.scriptsInsert);
    this.rootComponentFactory = combine(arguments, arg => arg.rootComponentFactory);
    this.routerFactory = combine(arguments, arg => arg.routerFactory)
      .slice(-1)
      .pop();
  }

  get router() {
    return this.routerFactory();
  }

  get routes() {
    return this.route.map((component, idx) => React.cloneElement(component, { key: idx + this.route.length }));
  }

  get navItems() {
    return this.navItem.map((component, idx) =>
      React.cloneElement(component, {
        key: component.key ? component.key : idx + this.navItem.length,
      }),
    );
  }

  get navItemsRight() {
    return this.navItemRight.map((component, idx) =>
      React.cloneElement(component, {
        key: component.key ? component.key : idx + this.navItem.length,
      }),
    );
  }

  get reducers() {
    return merge(...this.reducer);
  }

  get resolvers() {
    return merge(...this.resolver);
  }

  get middlewares() {
    return this.middleware;
  }

  get afterwares() {
    return this.afterware;
  }

  get connectionParams() {
    return this.connectionParam;
  }

  get constructFetchOptions() {
    return this.createFetchOptions.length
      ? (...args) => {
          try {
            let result = {};
            for (let func of this.createFetchOptions) {
              result = { ...result, ...func(...args) };
            }
            return result;
          } catch (e) {
            console.log(e.stack);
          }
        }
      : null;
  }

  get stylesInserts() {
    return this.stylesInsert;
  }

  get scriptsInserts() {
    return this.scriptsInsert;
  }

  public getWrappedRoot(root, req) {
    let nestedRoot = root;
    for (const componentFactory of this.rootComponentFactory) {
      nestedRoot = React.cloneElement(componentFactory(req), {}, nestedRoot);
    }
    return nestedRoot;
  }
}
