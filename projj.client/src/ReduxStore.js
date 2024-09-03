import { configureStore } from "@reduxjs/toolkit";

import loginStatusReducer from "./ReduxState/loginStatusSlice";
import currentUserReducer from "./ReduxState/currentUserSlice";
import projectsReducer from "./ReduxState/projectsSlice";
import singleProjectReducer from "./ReduxState/singleProjectSlice";
import inputValueReducer from "./ReduxState/inputValueSlice";
import currentProjectTasksReducer from "./ReduxState/currentProjectTasks";

export const store = configureStore({
  reducer: {
    loginStatus: loginStatusReducer,
    currentUser: currentUserReducer,
    projects: projectsReducer,
    singleProject: singleProjectReducer,
    inputValue: inputValueReducer,
    currentProjectTasks: currentProjectTasksReducer,
  },
});
