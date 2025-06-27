import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    status : false,
    userData : null,
    userGameData : null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login(state, action) {
            state.status = true;
            state.userData = action.payload.userData;
        },
        logout(state) {
            state.status = false;
            state.userData = null;
            state.userGameData = null;
        },
        updateUserData(state, action) {
            state.userGameData = action.payload.userGameData;
        }
    }
});

export const { login, logout, updateUserData } = authSlice.actions;
export default authSlice.reducer;