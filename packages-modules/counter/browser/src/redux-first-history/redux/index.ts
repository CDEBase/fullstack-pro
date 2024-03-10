// Import createSlice from Redux Toolkit
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type * as rtk from "@reduxjs/toolkit";

// Define initial state
const initialState = 0;

// Create a slice for the counter with `createSlice`
const connectedReactRouterCounterSlice = createSlice({
    name: 'redux-data', // A name, used in action types
    initialState,
    reducers: {
        // The name of the reducer serves as the name of the action
        increment(state) {
            return state + 1;
        },
        decrement(state) {
            return state - 1;
        },
    },
});

// Export the reducer
const { reducer, actions } = connectedReactRouterCounterSlice;

// Export actions
export const { increment, decrement } = actions;

export default reducer;
