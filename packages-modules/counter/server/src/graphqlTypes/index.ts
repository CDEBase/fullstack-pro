// Components
import { Feature } from '@common-stack/server-core';
import createResolvers from './resolvers';

const graphqlFiles = (<any>require).context('', true, /\**.graphql?/);

const schema = graphqlFiles.keys().map((graphqlName) => {
    return graphqlFiles(graphqlName);
});

export default new Feature({ schema, createResolversFunc: createResolvers } as any);
