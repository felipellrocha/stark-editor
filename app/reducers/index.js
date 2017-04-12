import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import app from './app';

/*
import rereducer from 'reduce-reducers';

const sliceReducer = combineReducers({
  routing,
});

console.log(rereducer);

const rootReducer = rereducer(app, sliceReducer);

console.log(rootReducer);

export default rootReducer;
*/
export default app;
