import Counter from './sql';

import createResolvers from './resolvers';
import Feature from '../connector';

const graphqlFiles = (<any>require).context('', true, /\**.graphql?/);

const schema = graphqlFiles.keys().map((graphqlName) => {
  return graphqlFiles(graphqlName);
});

export default new Feature({
  schema,
  createResolversFunc: createResolvers,
  createContextFunc: () => ({ Counter: new Counter() }),
} as any);
