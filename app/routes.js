import { Route, IndexRoute } from 'react-router';


export default (
  <Route path="/" component={App}>
    <IndexRoute component={TileSelectorPage} />
  </Route>
);
