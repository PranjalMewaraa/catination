// store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import employeeReducer from "./slices/employeeSlice";
import filesReducer from "./slices/filesSlice";
const store = configureStore({
  reducer: {
    user: userReducer,
    employee: employeeReducer,
    files: filesReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
