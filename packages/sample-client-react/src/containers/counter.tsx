import {
  incrementCounter,
  loadCount,
  saveCount,
  Action
} from '@sample/client-redux'
import { connect } from 'react-redux'

import * as redux from 'redux';
import { Store } from '@sample/client-redux'
import { CounterComponent, OwnProps, ConnectedState, ConnectedDispatch } from '../components';

const mapStateToProps = (state: Store.All, ownProps: OwnProps): ConnectedState => ({
  counter: state["@sample/counter"],
  isSaving: state["@sample/isSaving"],
  isLoading: state["@sample/isLoading"],
  error: state["@sample/error"],
})

const mapDispatchToProps = (dispatch: redux.Dispatch<Store.All>): ConnectedDispatch => ({
  increment: (n: number) =>
    dispatch(incrementCounter(n)),
  load: () =>
    dispatch(loadCount(null)),
  save: (value: number) =>
    dispatch(saveCount({ value })),
})

export const Counter: React.ComponentClass<OwnProps> = connect(mapStateToProps, mapDispatchToProps)(CounterComponent)
