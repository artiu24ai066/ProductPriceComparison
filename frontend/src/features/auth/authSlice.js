import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    accessToken: null,
    isAuthenticated: false,
    loading: true,
};

const authSlice = createSlice({
    name: "auth",

    initialState,

    reducers: {

        loginSuccess: (state, action) => {
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
            state.isAuthenticated = true;
            state.loading = false;
        },

        logoutSuccess: (state) => {
            state.user = null;
            state.accessToken = null;
            state.isAuthenticated = false;
            state.loading = false;
        },

        restoreUser: (state, action) => {
            state.user = action.payload.user;
            state.isAuthenticated = true;
            state.loading = false;
        },

        authFinished: (state) => {
            state.loading = false;
        },

    },
});

export const {
    loginSuccess,
    logoutSuccess,
    restoreUser,
    authFinished,
} = authSlice.actions;

export default authSlice.reducer;