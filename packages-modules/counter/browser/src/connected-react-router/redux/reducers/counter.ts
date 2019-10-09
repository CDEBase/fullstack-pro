import { Action } from 'redux';
import { CONNECTED_REACT_ROUTER_ACTION_TYPES } from '../../constants';

const connectedReactRouter_counter = (state = 0, action: Action) => {
    switch (action.type) {
        case CONNECTED_REACT_ROUTER_ACTION_TYPES.INCREMENT:
            return state + 1;
        case CONNECTED_REACT_ROUTER_ACTION_TYPES.DECREMENT:
            return state - 1;
        default:
            return state;
    }
};

export { connectedReactRouter_counter };
