import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  Grid,
} from 'components';

import styles from './styles.css';

class component extends Component {
  render() {
    const {
      app: {
        grid,
        tile,
      }
    } = this.props;

    const data = [...Array(grid.rows * grid.columns)].map((_, i) => [0, i])

    return (
      <div className={styles.component} >
        <Grid grid={grid} data={data} />
      </div>
    );
  }
}

export default connect(
  (state) => ({
    app: state.app,
  }),
)(component);
