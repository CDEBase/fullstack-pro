import * as React from 'react';
import { Layout, ConfigProvider } from 'antd';
import counterModules from '@sample-stack/counter-module-browser';
import { Feature, FeatureWithRouterFactory, sortKeys } from '@common-stack/client-react';
import { useRoutes } from "react-router-dom";
import { SiderMenu } from './layout';
import '@sample-stack/assets';
import { ErrorBoundary } from '../app/ErrorBoundary';

const features = new Feature(FeatureWithRouterFactory, counterModules);

// console.log(features.getRoutes());
// features.getRoutes() shouyld be updated as following, this code will be replaced after that.
let routeConfig = sortKeys(features.routeConfig)
    .map((route) => Object.values(route)[0])
    .map((route) => ({ ...route, Component: route.component }));
console.log(routeConfig);

export const MainRoute = (props) => {
    const routes = useRoutes(routeConfig);

    return <ConfigProvider theme={{ hashed: false }}>
        <ErrorBoundary>
            <Layout hasSider={true} style={{ minHeight: '100vh', display: 'flex' }}>
                <SiderMenu
                    collapsed={false}
                    menuData={features.getMenus()}
                    location={{ pathname: '/' } as any}
                    segments={features.sidebarSegments}
                />
                <Layout>
                    <Layout.Content style={{ height: '100%' }}>
                        <section className="flex-grow" style={{ height: '100%' }}>
                            {routes}
                        </section>
                    </Layout.Content>
                </Layout>
            </Layout>
        </ErrorBoundary>
    </ConfigProvider>
}

export default features;
