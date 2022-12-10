import { Feature, FeatureWithRouterFactory, renderRoutes2 } from '@common-stack/client-react';

const features = new Feature(
    FeatureWithRouterFactory,
);

const configuredRoutes = features.getConfiguredRoutes();

const routes = renderRoutes2({ routes: configuredRoutes });

export const MainRoute = props => {
    return (
    )
};

export default features;
