import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import {
  Tile,
  InlineSVG,
} from 'components';

import {
  writeFile,
  openFile,
} from 'actions';

import styles from './styles.css';

class component extends Component {
  constructor(props) {
    super(props);

    this._handleWrite = this._handleWrite.bind(this);
    this._handleOpen = this._handleOpen.bind(this);
  }

  _handleOpen() {
    const {
      dispatch,
    } = this.props;

    dispatch(openFile());
  }

  _handleWrite() {
    const {
      dispatch,
    } = this.props;

    dispatch(writeFile());
  }

  render() {
    const {
      app: {
        selectedTile: [
          setIndex,
          tileIndex,
        ],
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
          <InlineSVG className={styles.icon} icon="upload" onClick={this._handleOpen} />
          <InlineSVG className={styles.icon} icon="download" onClick={this._handleWrite} />
          <InlineSVG className={styles.icon} icon="cog" />
        </div>
      </div>
    );
  }
}

export default connect(
  (state) => ({
    app: state,
  }),
)(component);
