import { createSlice } from '@reduxjs/toolkit';

const now = new Date();
const initialState: {
  currentYear: number;
  currentMonth: number;
} = {
  currentYear: now.getFullYear(),
  currentMonth: now.getMonth() + 1
};

const slice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    setCurrentYear: (state, action) => {
      return { ...state, ...{ currentYear: action.payload } };
    },
    setCurrentMonth: (state, action) => {
      return { ...state, ...{ currentMonth: action.payload } };
    }
  }
});

export const { setCurrentYear, setCurrentMonth } = slice.actions;
export default slice.reducer;
