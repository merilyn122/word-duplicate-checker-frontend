import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, AuthResponse, User } from '../../types';

const initialState: AuthState = {
    user: null,
    token: localStorage.getItem('token'),
    loading: false,
    error: null,
    // 添加 isAuthenticated，基于 token 是否存在
    isAuthenticated: !!localStorage.getItem('token'),
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (state, action: PayloadAction<AuthResponse>) => {
            state.loading = false;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.error = null;
            state.isAuthenticated = true;
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('user', JSON.stringify(action.payload.user));
        },
        loginFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        },
    },
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;