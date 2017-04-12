import React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import { Router, hashHistory } from 'react-router';
import { AppContainer } from 'react-hot-loader';
import { syncHistoryWithStore } from 'react-router-redux';
import configureStore from './store/configureStore';
//import routes from './routes';
//import './app.global.css';

import {
  TileSelectorPage,
} from './components';

const store = configureStore();

render(
  <AppContainer>
    <Provider store={store}>
      <TileSelectorPage />
    </Provider>
  </AppContainer>,
  document.getElementById('root')
);
