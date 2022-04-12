import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';

import message from './message';

const rootReducer = combineReducers({
  message
});

const store = configureStore({ reducer: rootReducer });

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export default store;
