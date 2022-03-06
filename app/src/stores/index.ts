import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';

import calendar from './calendar';

const rootReducer = combineReducers({
  calendar
});

const store = configureStore({ reducer: rootReducer });

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export default store;
