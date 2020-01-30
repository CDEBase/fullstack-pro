import Module from '../module';

import 'jest';

describe('connector modules', () => {

    it('module configuredRoutes', () => {
        const configuredRoutes = Module.getConfiguredRoutes();

        expect(configuredRoutes).toMatchSnapshot();
    });

    it('module routes', () => {
        const routes = Module.getRoutes();

        expect(routes).toMatchSnapshot();
    });
});
