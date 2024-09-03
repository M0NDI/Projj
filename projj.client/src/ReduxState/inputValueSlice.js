// inputValueSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: '',
};

export const inputValueSlice = createSlice({
  name: "inputValue",
  initialState,
  reducers: {
    setInputValue: (state, action) => {
      state.value = action.payload;
    },
    resetInputValue: (state) => {
      state.value = '';
    },
  },
});

// Action creators are generated for each case reducer function
export const { setInputValue, resetInputValue } = inputValueSlice.actions;

export default inputValueSlice.reducer;