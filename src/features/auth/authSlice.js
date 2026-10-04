import { createSlice } from "@reduxjs/toolkit";
import { syncUserStorage } from "../../api/userService"; // Sync Helper ခေါ်ယူခြင်း

const activeUser = localStorage.getItem("makerhub_active_user")
  ? JSON.parse(localStorage.getItem("makerhub_active_user"))
  : null;

const initialState = {
  user: activeUser,
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
    // Progress တက်လာပါက Redux ရော LocalStorage ရော Sync ဖြစ်စေရန်
    updateUserProgress: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        // Storage နှစ်ခုလုံးကို Sync သွားပြင်ပေးမည်
        syncUserStorage(state.user);
      }
    },
  },
});

export const { login, logout, updateUserProgress } = authSlice.actions;
const authReducer = authSlice.reducer;
export default authReducer;
