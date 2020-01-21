const defaultState = {
  reduxCount: 1,
};

export const reducers = function (state = defaultState, action) {
  switch (action.type) {
    case 'COUNTER_INCREMENT':
      return {
        ...state,
        reduxCount: state.reduxCount + action.value,
      };

    default:
      return state;
  }
};

