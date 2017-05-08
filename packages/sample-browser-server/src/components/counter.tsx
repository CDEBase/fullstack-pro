import * as React from 'react'
import * as redux from 'redux'
import { connect } from 'react-redux'

import {
  incrementCounter,
  loadCount,
  saveCount,
  Action
} from '../actions'

import { Store } from '../reducers'

export type OwnProps = {
  label: string,
  store?: redux.Store<Store.All>
}

export type ConnectedState = {
  counter: { value: number }
  isSaving: boolean,
  isLoading: boolean,
  error: string,
}

export type ConnectedDispatch = {
  increment: (n: number) => void
  save: (n: number) => void
  load: () => void
}

const mapStateToProps = (state: Store.All, ownProps: OwnProps): ConnectedState => ({
  counter: state.counter,
  isSaving: state.isSaving,
  isLoading: state.isLoading,
  error: state.error,
})

// const mapDispatchToProps = (dispatch: redux.Dispatch<Store.All>): ConnectedDispatch => ({
//   increment: (n: number) =>
//     dispatch(incrementCounter(n)),
//   load: () =>
//     loadCount(null)(dispatch),
//   save: (value: number) =>
//     saveCount({ value })(dispatch),
// })

const mapDispatchToProps = (dispatch: redux.Dispatch<Store.All>): ConnectedDispatch => ({
  increment: (n: number) =>
    dispatch(incrementCounter(n)),
  load: () =>
    dispatch(loadCount(null)),
  save: (value: number) =>
    dispatch(saveCount({ value })),
})

class CounterComponent extends React.Component<ConnectedState & ConnectedDispatch & OwnProps, {}> {

  _onClickIncrement = (e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault()
    this.props.increment(1)
  }

  _onClickSave = (e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (!this.props.isSaving) {
      this.props.save(this.props.counter.value)
    }
  }

  _onClickLoad = (e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (!this.props.isLoading) {
      this.props.load()
    }
  }

  render () {
    const { counter, label, isSaving, isLoading, error } = this.props
    return <form>
      <legend>{label}</legend>
      <pre>{JSON.stringify({ counter, isSaving, isLoading }, null, 2)}</pre>
      <button ref='increment' onClick={this._onClickIncrement}>click me!</button>
      <button ref='save' disabled={isSaving} onClick={this._onClickSave}>{isSaving ? 'saving...' : 'save'}</button>
      <button ref='load' disabled={isLoading} onClick={this._onClickLoad}>{ isLoading ? 'loading...' : 'load'}</button>
      { error ? <div className='error'>{error}</div> : null }
    </form>
  }
}

// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/8787
export const Counter: React.ComponentClass<OwnProps> = connect(mapStateToProps, mapDispatchToProps)(CounterComponent)
