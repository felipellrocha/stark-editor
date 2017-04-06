import React, { Component } from 'react';
import { connect } from 'react-redux';

import styles from './styles.css';

class Tile extends Component {
  render() {
    const {
      app,
    } = this.props;

    return (
      <div className={styles.component}>
        { app.name }
      </div>
    );
  }
}

export default connect(
  (state) => ({
    app: state.app,
  }),
)(Tile);
