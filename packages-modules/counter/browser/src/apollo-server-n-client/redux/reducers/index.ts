// Import createSlice from Redux Toolkit
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type * as rtk from "@reduxjs/toolkit";

// Define the initial state type
interface DefaultState {
    reduxCount: number;
}

// Define the initial state
const initialState: DefaultState = {
    reduxCount: 1,
};

// Create the slice
const counterSlice = createSlice({
    name: 'counter', // the name of your slice, used in action types
    initialState,
    reducers: {
        // Define the reducer and automatically generate associated action
        increment: (state, action: PayloadAction<number>) => {
            state.reduxCount += action.payload; // Immer allows us to "mutate" the state
        },
    },
});

// Export the reducer, generated from the slice
export const counterReducer = counterSlice.reducer;

// Export the action creators
export const { increment } = counterSlice.actions;
