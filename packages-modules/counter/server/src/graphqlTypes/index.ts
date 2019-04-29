// Components
import createResolvers from './resolvers';
import { Feature } from '@common-stack/server-core';

const graphqlFiles = (<any>require).context('', true, /\**.graphql?/);

const schema = graphqlFiles.keys().map((graphqlName) => {
  return graphqlFiles(graphqlName);
});

export default new Feature({ schema, createResolversFunc: createResolvers } as any);
