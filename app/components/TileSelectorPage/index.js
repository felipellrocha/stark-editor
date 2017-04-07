import React, { Component } from 'react';
import { connect } from 'react-redux';

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

export default connect(
  (state) => ({
    app: state.app,
  }),
)(component);
