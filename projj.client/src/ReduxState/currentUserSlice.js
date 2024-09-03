import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

export const currentUserSlice = createSlice({
  name: "currentUser",
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.value = action.payload;
    },
  },
  /* extraReducers: (builder) => {
    builder.addCase(setCurrentUserAsync.fulfilled, (state, action) => {
      state.value = action.payload;
    });
  }, */
});

/* export const setCurrentUserAsync = createAsyncThunk(
  "currentUser/setCurrentUserAsync",
  async (newCurrentUser) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return newCurrentUser;
  }
);
 */
export const { setCurrentUser } = currentUserSlice.actions;

export default currentUserSlice.reducer;
