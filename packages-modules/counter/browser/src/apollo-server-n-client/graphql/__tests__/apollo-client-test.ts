
import { client } from './apollo-client-test-helper';
import { ADD_COUNTER_CLIENT } from '../mutations';
import 'jest';


describe('Apollo Client tests', () => {
    it('client test', async () => {

        const result = await client.mutate({
            mutation: ADD_COUNTER_CLIENT,
            variables: { amount: 1 },
            // data: {},
        });
        expect(result).toEqual({ data: { addCounterState: null }, errors: undefined });

    });
});
