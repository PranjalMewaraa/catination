import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  activeEmployee: [],
  pastEmployee: [],
  loading: false,
  error: null,
};

const employeeSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {
    setActiveEmployee: (state, action: PayloadAction) => {
      state.activeEmployee = action.payload;
    },
    setPrevEmployee: (state, action: PayloadAction) => {
      state.pastEmployee = action.payload;
    },
    setLoading: (state, action: PayloadAction) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction) => {
      state.error = action.payload;
    },
  },
});

export const { setActiveEmployee, setPrevEmployee, setLoading, setError } =
  employeeSlice.actions;

export default employeeSlice.reducer;
