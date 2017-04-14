import { combineReducers } from 'redux';
import app from './app';
import global from './global';

const sliceReducer = combineReducers({
  app,
  global,
});

export default sliceReducer;
