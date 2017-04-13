import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import {
  Tile,
  InlineSVG,
  Button,
} from 'components';

import {
  writeFile,
  selectTile,
  openFile,
} from 'actions';

import styles from './styles.css';

class component extends PureComponent {
  constructor(props) {
    super(props);

    this._handleWrite = this._handleWrite.bind(this);
    this._handleOpen = this._handleOpen.bind(this);
    this._handleClear = this._handleClear.bind(this);
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

  _handleClear() {
    const {
      dispatch,
    } = this.props;

    dispatch(selectTile({setIndex: -1, tileIndex: 0}));
  }

  render() {
    const {
      selectedTile: [
        setIndex,
        tileIndex,
      ],
    } = this.props;

    return (
      <div className={styles.component}>
        <div className="left">
          <Tile setIndex={setIndex} tileIndex={tileIndex} className={styles.tile} />
          <div className="clear" onClick={this._handleClear}>
            <InlineSVG className={styles.icon} icon="cross" /> Clear tile selection
          </div>
        </div>
        <div className="middle">
        </div>
        <div className="right">
          <Button onClick={this._handleOpen} className={styles.button}>
            <InlineSVG className={styles.buttonIcon} icon="upload" /> Open
          </Button>
          <Button onClick={this._handleWrite} className={styles.button}>
            <InlineSVG className={styles.buttonIcon} icon="download" /> Save
          </Button>
          <Button className={styles.button}>
            <InlineSVG className={styles.buttonIcon} icon="cog" />
          </Button>
        </div>
      </div>
    );
  }
}

export default connect(
  (state) => ({
    selectedTile: state.selectedTile,
  }),
)(component);
