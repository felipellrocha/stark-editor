import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import {
  Tile,
  InlineSVG,
} from 'components';

import styles from './styles.css';

class component extends Component {
  render() {
    const {
      app: {
        name,
        tilesets,
        selectedTile: [
          setIndex,
          tileIndex,
        ],
        layers,
        selectedLayer,
      },
    } = this.props;

    return (
      <div className={styles.component}>
        <div className="left">
          <Tile setIndex={setIndex} tileIndex={tileIndex} />
        </div>
        <div className="middle">
        </div>
        <div className="right">
          <InlineSVG className={styles.icon} icon="upload" />
          <InlineSVG className={styles.icon} icon="download" />
          <InlineSVG className={styles.icon} icon="cog" />
        </div>
      </div>
    );
  }
}

export default connect(
  (state) => ({
    app: state.app,
  }),
)(component);
