import * as React from 'react';
import { Layout } from 'antd';
import { ConnectedRouter } from 'connected-react-router';
import { ElectronTrayModule } from '@sample-stack/counter-module-browser';
import { Feature, FeatureWithRouterFactory } from '@common-stack/client-react';

// import counterModules from '@sample-stack/counter-module-browser';

const features = new Feature(FeatureWithRouterFactory, ElectronTrayModule);
export const MainRoute = ({ history }) => (
    <>
        {features.getWrappedRoot(
            <ConnectedRouter history={history}>
                <Layout>
                    <Layout.Content style={{ height: '100%' }}>
                        <section className="flex-grow" style={{ height: '100%' }}>
                            {features.getRoutes()}
                        </section>
                    </Layout.Content>
                </Layout>
            </ConnectedRouter>
        )}
    </>
);

export default features;
