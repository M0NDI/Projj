import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

export const singleProjectSlice = createSlice({
  name: "singleProject",
  initialState,
  reducers: {
    setProject: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setProject } = singleProjectSlice.actions;

export default singleProjectSlice.reducer;
