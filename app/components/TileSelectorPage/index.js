import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  Grid,
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
      },
    } = this.props;

    return (
      <div className={styles.component} >
        <Grid grid={grid} data={data} tileAction={putDownTile} />
      </div>
    );
  }
}

export default connect(
  (state) => ({
    app: state.app,
  }),
)(component);
