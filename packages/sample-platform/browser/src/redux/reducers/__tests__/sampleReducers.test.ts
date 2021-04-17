import 'jest';
import { createStore, combineReducers } from 'redux';

import { reducers } from '../sampleReducers';
import { Store } from '../Store';

import { incrementCounter } from '../../actions';

describe('reducers/counter', () => {
    it('starts at 0', () => {
        const store = createStore(combineReducers<Store.Sample>(reducers));
        const counter = store.getState()['@sample-stack/counter'];
        expect(counter.value).toEqual(0);
    });

    it('increments', (done) => {
        const store = createStore(combineReducers<Store.Sample>(reducers));
        store.subscribe(() => {
            const counter = store.getState()['@sample-stack/counter'];
            expect(counter.value).toEqual(3);
            done();
        });
        store.dispatch(incrementCounter(3));
    });

    it('restores state', (done) => {
        const store = createStore(combineReducers<Store.Sample>(reducers));
        store.subscribe(() => {
            const counter = store.getState()['@sample-stack/counter'];
            expect(counter.value).toEqual(14);
            done();
        });
        store.dispatch({
            type: '@@sample-stack/LOAD_COUNT_SUCCESS',
            request: {},
            response: { value: 14 },
        });
    });
});
