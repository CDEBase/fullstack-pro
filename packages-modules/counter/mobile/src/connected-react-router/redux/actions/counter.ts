import { CONNECTED_REACT_ROUTER_ACTION_TYPES } from '../../constants';

export const increment = () => ({
    type: CONNECTED_REACT_ROUTER_ACTION_TYPES.INCREMENT,
});

export const decrement = () => ({
    type: CONNECTED_REACT_ROUTER_ACTION_TYPES.DECREMENT,
});
