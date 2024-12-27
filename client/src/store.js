import { configureStore } from '@reduxjs/toolkit';
import authReducer from './userSlice.js';

export const store = configureStore({
    reducer: {
        auth: authReducer,
    },
});