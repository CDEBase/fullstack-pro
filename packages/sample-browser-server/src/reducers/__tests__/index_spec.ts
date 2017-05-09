import 'jest';
import { createStore, combineReducers } from 'redux'

import { reducers, Store } from '../index'
import {
  incrementCounter,
} from '../../actions'

describe('reducers/counter', () => {
  it('starts at 0', () => {
    const store = createStore(combineReducers<Store.All>(reducers))
    const  counter  = store.getState()["@sample/counter"]
    expect(counter.value).toEqual(0)
  })

  it('increments', (done) => {
    const store = createStore(combineReducers<Store.All>(reducers))
    store.subscribe(() => {
      const counter = store.getState()["@sample/counter"]
      expect(counter.value).toEqual(3)
      done()
    })
    store.dispatch(incrementCounter(3))
  })

  it('restores state', (done) => {
    const store = createStore(combineReducers<Store.All>(reducers))
    store.subscribe(() => {
      const counter = store.getState()["@sample/counter"]
      expect(counter.value).toEqual(14)
      done()
    })
    store.dispatch({
      type: 'LOAD_COUNT_SUCCESS',
      request: {},
      response: { value: 14 } })
  })
})
