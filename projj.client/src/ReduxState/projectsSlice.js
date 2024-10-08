import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

export const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    setProjects: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setProjects } = projectsSlice.actions;

export default projectsSlice.reducer;
