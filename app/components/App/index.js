import React, { PureComponent } from 'react';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';

import { Route } from 'react-router-dom';
import styles from './styles.css';

import {
  TileSelectorPage,
  TileImportPage,

  Sidebar,
  Footer,
} from 'components';

class component extends PureComponent {
  render() {
    return (
      <div className={styles.component}>

        <Route exact path="/" component={TileSelectorPage} />
        <Route path="/import" component={TileImportPage} />

      </div>
    );
  };
};

export default compose(
  withRouter,
)(component);
