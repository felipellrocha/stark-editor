import React from 'react';
import { Route, IndexRoute } from 'react-router';
import {
  App,
  TileSelectorPage,
} from './components';


export default (
  <Route path="/" component={App}>
    <IndexRoute component={TileSelectorPage} />
  </Route>
);
