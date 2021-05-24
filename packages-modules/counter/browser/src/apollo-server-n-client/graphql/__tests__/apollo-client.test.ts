import { client } from './apollo-client-test-helper';
import { AddCounterDocument } from '../../../generated-models';
import 'jest';

describe('Apollo Client tests', () => {
    it('client test', async () => {
        const result = await client.mutate({
            mutation: AddCounterDocument,
            variables: { amount: 1 },
            // data: {},
        });
        expect(result).toEqual({ data: { addCounterState: null }, errors: undefined });
    });
});
