import { combineReducers, Action as reduxAction } from 'redux';
import { Action } from '../actions';
import { Store } from './Store';

function isSaving(state: boolean = false, action: Action): boolean {
  switch (action.type) {
    case '@@sample/SAVE_COUNT_REQUEST':
      return true;
    case '@@sample/SAVE_COUNT_SUCCESS':
    case '@@sample/SAVE_COUNT_ERROR':
      return false;
    default:
      return state;
  }
}

function isLoading(state: boolean = false, action: Action): boolean {
  switch (action.type) {
    case '@@sample/LOAD_COUNT_REQUEST':
      return true;
    case '@@sample/LOAD_COUNT_SUCCESS':
    case '@@sample/LOAD_COUNT_ERROR':
      return false;
    default:
      return state;
  }
}

function error(state: string = '', action: Action): string {
  switch (action.type) {
    case '@@sample/LOAD_COUNT_REQUEST':
    case '@@sample/SAVE_COUNT_REQUEST':
      return '';
    case '@@sample/LOAD_COUNT_ERROR':
    case '@@sample/SAVE_COUNT_ERROR':
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
    case '@@sample/INCREMENT_COUNTER':
      const { delta } = action;
      return { value: state.value + delta };

    case '@@sample/RESET_COUNTER':
      return { value: 0 };

    case '@@sample/LOAD_COUNT_SUCCESS':
      return { value: action.response.value };

    default:
      return state;
  }
}

export const reducers = {
  '@sample/counter': counter,
  '@sample/isSaving': isSaving,
  '@sample/isLoading': isLoading,
  '@sample/error': error,
};
