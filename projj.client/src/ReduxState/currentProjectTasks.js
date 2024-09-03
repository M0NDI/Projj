import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

export const currentProjectTasksSlice = createSlice({
  name: "currentProjectTasks",
  initialState,
  reducers: {
    setCurrentProjectTasks: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setCurrentProjectTasks } = currentProjectTasksSlice.actions;

export default currentProjectTasksSlice.reducer;
