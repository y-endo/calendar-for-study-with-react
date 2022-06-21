import { createSlice } from '@reduxjs/toolkit';
import { MicroCMSQueries } from 'microcms-js-sdk';

const initialState: {
  monthCalendar: MicroCMSQueries;
  scheduleList: MicroCMSQueries;
} = {
  monthCalendar: {},
  scheduleList: {}
};

const slice = createSlice({
  name: 'microCMSQueries',
  initialState,
  reducers: {
    setMonthCalendarQueries: (state, action) => {
      state.monthCalendar = action.payload;
    },
    setScheduleListQueries: (state, action) => {
      state.scheduleList = action.payload;
    }
  }
});

export const { setMonthCalendarQueries, setScheduleListQueries } = slice.actions;
export default slice.reducer;
