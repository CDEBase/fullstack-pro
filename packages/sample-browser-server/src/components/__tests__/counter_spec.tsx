// tslint:disable-next-line no-unused-variable
import 'jest';
import * as React from 'react'
import * as TestUtils from 'react-dom/test-utils'

import { createStore, combineReducers } from 'redux'

import { Counter } from '../counter'
import { reducers, Store } from '../../reducers'

describe('components/Counter', () => {

  it('renders', () => {
    const store = createStore(combineReducers<Store.All>(reducers))
    const renderer = TestUtils.createRenderer()
    expect(renderer.render(
      <Counter label='a counter!' store={store} />
    )).toMatchSnapshot()
  })

  describe('clicking "increment"', () => {
    it('increments counter', () => {
      const store = createStore(combineReducers<Store.All>(reducers))
      const counter = TestUtils.renderIntoDocument(
        <Counter label='a counter!' store={store} />
      )
      const [
        increment,
      ] = TestUtils.scryRenderedDOMComponentsWithTag(counter, 'button')
      TestUtils.Simulate.click(increment)
      TestUtils.Simulate.click(increment)
      TestUtils.Simulate.click(increment)

      const pre = TestUtils.findRenderedDOMComponentWithTag(counter, 'pre')
      expect(JSON.parse(pre.textContent).counter.value).toEqual(3)
    })
  })
})
