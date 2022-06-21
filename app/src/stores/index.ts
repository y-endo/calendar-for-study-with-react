import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';

import message from './message';
import microCMSQueries from './microCMSQueries';

const rootReducer = combineReducers({
  message,
  microCMSQueries
});

const store = configureStore({ reducer: rootReducer });

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export default store;
