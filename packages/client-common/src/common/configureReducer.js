// @flow weak
import type { Action, State } from './types';
import app from './app/reducer';
import auth from './auth/reducer';
import config from './config/reducer';
import device from './device/reducer';
import intl from './intl/reducer';
import todos from './todos/reducer';
import users from './users/reducer';
import { combineReducers } from 'redux';
import { fieldsReducer as fields } from './lib/redux-fields';

/*
 users and auth are removed from original version
 routerReducer is also used which don't exist in original version
 injectReducer is custom one added for asyncReducers
 Added custom changes
 */


// stackoverflow.com/q/35622588/233902
const resetStateOnSignOutReducer = (reducer, initialState) => (
  state: State,
  action: Action,
) => {
  // const userWasSignedOut =
  //   action.type === 'ON_AUTH' &&
  //   state.users.viewer &&
  //   !action.payload.firebaseUser;

  // TODO: [custom] instead hardcoded to false
  const userWasSignedOut = false;
  if (!userWasSignedOut) {
    return reducer(state, action);
  }
  // Purge sensitive data, preserve only app and safe initial state.
  return reducer({
    app: state.app,
    config: initialState.config,
    device: initialState.device,
    intl: initialState.intl,
  }, action);
};

const configureReducer = (initialState: Object) => {
  let reducer = combineReducers({
    app,
    auth,
    config,
    device,
    fields,
    intl,
    todos,
    routing,
    ...asyncReducers,
  });

  // The power of higher-order reducers, http://slides.com/omnidan/hor
  reducer = resetStateOnSignOutReducer(reducer, initialState);

  return reducer;
};

export const injectReducer = (store, reducers) => {
  store.asyncReducers = { ...store.asyncReducers, ...reducers };
  store.replaceReducer(configureReducer(store.getState(), store.asyncReducers));
};

export default configureReducer;
