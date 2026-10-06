import { createSlice } from "@reduxjs/toolkit";
import { syncUserStorage } from "../../api/userService";

const activeUser = localStorage.getItem("makerhub_active_user")
  ? JSON.parse(localStorage.getItem("makerhub_active_user"))
  : null;

const initialState = {
  user: activeUser, // 📍 checkDailyStreak မလိုတော့ပါ
  isLogin: !!activeUser,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      state.isLogin = true;
      syncUserStorage(action.payload);
    },
    logout: (state) => {
      state.user = null;
      state.isLogin = false;
      localStorage.removeItem("makerhub_active_user");
    },
    updateUserProgress: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        syncUserStorage(state.user);
      }
    },
  },
});

export const { login, logout, updateUserProgress } = authSlice.actions;
const authReducer = authSlice.reducer;
export default authReducer;
