import * as React from 'react';
import { Layout, ConfigProvider } from 'antd';
import counterModules from '@sample-stack/counter-module-browser';
import { Feature, FeatureWithRouterFactory } from '@common-stack/client-react';
import { SiderMenu } from './layout';
import '@sample-stack/assets';
import { ErrorBoundary } from '../app/ErrorBoundary';

const features = new Feature(FeatureWithRouterFactory, counterModules);

// console.log(features.getMenus());

export const MainRoute = (props) => (
    <ConfigProvider theme={{ hashed: false }}>
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
                            {features.getRoutes()}
                        </section>
                    </Layout.Content>
                </Layout>
            </Layout>
        </ErrorBoundary>
    </ConfigProvider>
);

export default features;
