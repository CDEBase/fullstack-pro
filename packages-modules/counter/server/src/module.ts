import { counterMock } from './services';
import schema from './schema/schema.graphql';
import { resolver } from './resolvers';
import { Feature } from '@common-stack/server-core';

export default new Feature({
    schema: schema,
    createResolversFunc: resolver,
    createContextFunc: () => ({ counterMock: counterMock }), // note anything set here should be singleton.
});
