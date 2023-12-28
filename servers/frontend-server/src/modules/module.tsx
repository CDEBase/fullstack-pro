import * as React from 'react';
import { Layout, ConfigProvider } from 'antd';
import counterModules from '@sample-stack/counter-module-browser';
import { Feature, FeatureWithRouterFactory, renderRoutes2 } from '@common-stack/client-react';
import { SiderMenu } from './layout';
import '@sample-stack/assets';
import { ErrorBoundary } from '../app/ErrorBoundary';

const features = new Feature(FeatureWithRouterFactory, counterModules);
const routeConfig = {
    routes: [
        ...features.getConfiguredRoutes2(),
        { component: () => <h1 data-testid="test">Fallback</h1> },
    ],
    withRoutesElement: true,
}
console.log(routeConfig);
export const MainRoute = (props) => {
    return (
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
                                {renderRoutes2(routeConfig)}
                            </section>
                        </Layout.Content>
                    </Layout>
                </Layout>
            </ErrorBoundary>
        </ConfigProvider>
    );
}
export default features;
