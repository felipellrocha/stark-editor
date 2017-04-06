import React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import { Router, hashHistory } from 'react-router';
import { AppContainer } from 'react-hot-loader';
import { syncHistoryWithStore } from 'react-router-redux';
import configureStore from './store/configureStore';
import routes from './routes';
//import './app.global.css';

const store = configureStore();
const history = syncHistoryWithStore(hashHistory, store);

const Root = function({ store, history }) {
  return (
    <Provider store={store}>
      <Router key={Math.random()} history={history} routes={routes} />
    </Provider>
  );
}

render(
  <AppContainer>
    <Root store={store} history={history} />
  </AppContainer>,
  document.getElementById('root')
);
