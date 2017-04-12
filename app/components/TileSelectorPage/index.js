import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

// this needs to be imported like this because on some bug
// on importing. I don't know if the issue is with babel
// or webpack.
import App from 'components/App';

import {
  Grid,
  Workspace,
} from 'components';

import {
  putDownTile,
} from 'actions';

import styles from './styles.css';

class component extends Component {
  render() {
    const {
      app: {
        grid,
        tile,
        data,
        layers
      },
    } = this.props;

    return (
      <div className={styles.component} >
        <Workspace
          layers={layers}
        />
      </div>
    );
  }
}

export default compose(
  connect(state => ({ app: state })),
  App(),
)(component);
