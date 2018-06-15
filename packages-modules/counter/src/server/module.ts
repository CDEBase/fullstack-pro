import Counter from './sql';
import * as path from 'path';
const schema = require('./schema/schema.graphql');
import { resolver } from './resolvers';
import { Feature } from '@common-stack/server-core';

export default new Feature({
    schema: schema,
    createResolversFunc: resolver,
    createContextFunc: () => ({ Counter: new Counter() }),
} as any);
