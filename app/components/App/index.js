import React, { PureComponent } from 'react';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';

import { Route } from 'react-router-dom';
import styles from './styles.css';

import {
  SelectorPage,
  ImportPage,

  Sidebar,
  Footer,
} from 'components';

class component extends PureComponent {
  render() {
    return (
      <div className={styles.component}>

        <Route exact path="/" component={SelectorPage} />
        <Route path="/import" component={ImportPage} />

      </div>
    );
  };
};

export default compose(
  withRouter,
)(component);
