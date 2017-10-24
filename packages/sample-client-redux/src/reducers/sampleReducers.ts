import { combineReducers, Action as reduxAction } from 'redux';
import { Action } from '../actions';
import { Store } from './Store';

function isSaving(state: boolean = false, action: Action): boolean {
  switch (action.type) {
    case '@@sample-stack/SAVE_COUNT_REQUEST':
      return true;
    case '@@sample-stack/SAVE_COUNT_SUCCESS':
    case '@@sample-stack/SAVE_COUNT_ERROR':
      return false;
    default:
      return state;
  }
}

function isLoading(state: boolean = false, action: Action): boolean {
  switch (action.type) {
    case '@@sample-stack/LOAD_COUNT_REQUEST':
      return true;
    case '@@sample-stack/LOAD_COUNT_SUCCESS':
    case '@@sample-stack/LOAD_COUNT_ERROR':
      return false;
    default:
      return state;
  }
}

function error(state: string = '', action: Action): string {
  switch (action.type) {
    case '@@sample-stack/LOAD_COUNT_REQUEST':
    case '@@sample-stack/SAVE_COUNT_REQUEST':
      return '';
    case '@@sample-stack/LOAD_COUNT_ERROR':
    case '@@sample-stack/SAVE_COUNT_ERROR':
      return action.error.toString();
    default:
      return state;
  }
}

const initialState: Store.Counter = {
  value: 0,
};

function counter(state: Store.Counter = initialState, action: Action): Store.Counter {
  switch (action.type) {
    case '@@sample-stack/INCREMENT_COUNTER':
      const { delta } = action;
      return { value: state.value + delta };

    case '@@sample-stack/RESET_COUNTER':
      return { value: 0 };

    case '@@sample-stack/LOAD_COUNT_SUCCESS':
      return { value: action.response.value };

    default:
      return state;
  }
}

export const reducers = {
  '@sample-stack/counter': counter,
  '@sample-stack/isSaving': isSaving,
  '@sample-stack/isLoading': isLoading,
  '@sample-stack/error': error,
};
