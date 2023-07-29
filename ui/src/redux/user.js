import { createSlice } from '@reduxjs/toolkit';

const initialStateValue = {
  first_name: '',
  last_name: '',
  email: '',
  designation: '',
  level: ''
};

export const userSlice = createSlice({
  name: 'user',
  initialState: { value: initialStateValue },
  reducers: {
    setUser: (state, action) => {
      state.value = action.payload;
    },
    clearUser: (state) => {
      state.value = initialStateValue;
    }
  }
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
