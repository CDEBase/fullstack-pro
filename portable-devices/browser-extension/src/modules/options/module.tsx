import * as React from 'react';
import { Feature, FeatureWithRouterFactory, renderRoutes2 } from '@common-stack/client-react';

const features = new Feature(
    FeatureWithRouterFactory,
);

const configuredRoutes = features.getConfiguredRoutes();

const routes = renderRoutes2({ routes: configuredRoutes });

export const MainRoute = props => {
    return (
        <React.Suspense fallback={<span>Loading....</span>}>
                {routes}
        </React.Suspense>
    );
};

export default features;
