import { createSlice } from '@reduxjs/toolkit';

const initialState: {
  list: {
    id: number;
    text: string;
    autoDelete?: boolean;
    autoDeleteTime?: number;
  }[];
} = {
  list: []
};

const slice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    addList: (state, action) => {
      state.list.push(action.payload);
    },
    deleteList: (state, action) => {
      return { ...state, ...{ list: state.list.filter(data => data.id !== action.payload) } };
    },
    clear: () => initialState
  }
});

export const { addList, deleteList, clear } = slice.actions;
export default slice.reducer;
