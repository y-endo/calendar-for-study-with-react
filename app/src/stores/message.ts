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
    addMessage: (state, action) => {
      state.list.push(action.payload);
    },
    deleteMessage: (state, action) => {
      return { ...state, ...{ list: state.list.filter(data => data.id !== action.payload) } };
    },
    clearMessage: () => initialState
  }
});

export const { addMessage, deleteMessage, clearMessage } = slice.actions;
export default slice.reducer;
