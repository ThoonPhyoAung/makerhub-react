import { createSlice } from "@reduxjs/toolkit";

// LocalStorage ထဲမှ Initial Data များကို ဆွဲထုတ်ယူခြင်း
const activeUser = localStorage.getItem("makerhub_active_user")
  ? JSON.parse(localStorage.getItem("makerhub_active_user"))
  : null;

const initialState = {
  user: activeUser,
  isLogin: !!activeUser, // activeUser ရှိပါက true, မရှိပါက false
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      // action.payload ထဲတွင် user object အပြည့်အစုံ ပါဝင်မည်
      state.user = action.payload; // this is user data and info
      state.isLogin = true;

      // LocalStorage သို့ Session Data သိမ်းဆည်းခြင်း
      localStorage.setItem("makerhub_active_user", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.isLogin = false;

      // LocalStorage ရှိ Session Data ကို ရှင်းထုတ်ခြင်း
      localStorage.removeItem("makerhub_active_user");
    },
    // User ရဲ့ XP နှင့် Streak Dynamic တိုးလာပါက Redux State တွင် Update လုပ်ရန်
    updateUserProgress: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem("makerhub_active_user", JSON.stringify(state.user));
      }
    },
  },
});

export const { login, logout, updateUserProgress } = authSlice.actions;
const authReducer = authSlice.reducer;
export default authReducer;