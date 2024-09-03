import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: false,
};

export const loginStatusSlice = createSlice({
  name: "loginStatus",
  initialState,
  reducers: {
    setLoginFalse: (state) => {
      state.value = false;
    },
    setLoginTrue: (state) => {
      state.value = true;
    },
    setLoginStatus: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setLoginFalse, setLoginTrue, setLoginStatus } = loginStatusSlice.actions;

export default loginStatusSlice.reducer;