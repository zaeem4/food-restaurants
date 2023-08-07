import { createSlice } from "@reduxjs/toolkit";

const initialStateValue = {
  userName: "",
  email: "",
  role: "",
  permissions: {
    dashboard: false,
    restaurants: false,
    meals: false,
    invoices: false,
    companies: false,
    menus: false,
    orders: false,
    employees: false,
    reports: false,
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState: { value: initialStateValue },
  reducers: {
    setUser: (state, action) => {
      state.value = action.payload;
    },
    clearUser: (state) => {
      state.value = initialStateValue;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
