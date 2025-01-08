import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        clearUser: (state) => {
            state.user = null;
        },
        updateUser: (state, action) => {
            state.user = action.payload;
        },
    },
});

export const { setUser, clearUser,updateUser } = authSlice.actions;

export default authSlice.reducer;
