import { createSlice } from '@reduxjs/toolkit';
import { RootState } from './store';

const initialState: { users: any, currentUser: any } = { users: [], currentUser: null }

const regSlice = createSlice({
    name: 'reg',
    initialState,
    reducers: {
        register: (state, action) => {
            state.users.push(action.payload);
        },
        currentUser: (state, action) => {
            state.currentUser = action.payload;
        },
        saveUserGames: (state, action) => {
            state.currentUser.games.push(...action.payload);
        },
        mergeGames: (state, action) => {
            state.users[action.payload.index].games.push(...action.payload.arr);
        }
    }
});

export const { register, currentUser, saveUserGames, mergeGames } = regSlice.actions;

export const selectUsers = (state: RootState) => state.reg.users;
export const currentLoggedUser = (state: RootState) => state.reg.currentUser;
export const currentUserGames = (state: RootState) => state.reg.currentUser.games;

export const regReducer = regSlice.reducer;