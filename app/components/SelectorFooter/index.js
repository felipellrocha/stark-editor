import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom'

import {
  Tile,
  InlineSVG,
  Button,
} from 'components';

import {
  writeFile,
  selectTile,
  openFile,
  changeZoom,
  changeTilingMethod,
} from 'actions';

import styles from './styles.css';

class component extends PureComponent {
  constructor(props) {
    super(props);

    this._handleSettings = this._handleSettings.bind(this);
    this._handleWrite = this._handleWrite.bind(this);
    this._handleOpen = this._handleOpen.bind(this);
    this._handleClear = this._handleClear.bind(this);
    this._handleChangeZoom = this._handleChangeZoom.bind(this);
    this._handleChangeTileMethod = this._handleChangeTileMethod.bind(this);
  }

  _handleSettings() {
    const {
      history,
    } = this.props;

    history.push('/settings');
  }

  _handleChangeTileMethod(value) {
    const {
      dispatch,
    } = this.props;

    dispatch(changeTilingMethod(value));
  }

  _handleChangeZoom(e) {
    const {
      dispatch,
    } = this.props;

    dispatch(changeZoom(e.target.value));
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
      zoom,
      selectedAction,
      className,
    } = this.props;

    const classes = classnames(styles.component, className);

    return (
      <div className={classes}>
        <div className="left">
          <Tile setIndex={setIndex} tileIndex={tileIndex} className={styles.tile} />
          <div className="clear" onClick={this._handleClear}>
            <InlineSVG className={styles.icon} icon="cross" /> Clear tile selection
          </div>
        </div>
        <div className="tiling">
          <a onClick={() => this._handleChangeTileMethod('put')}>
            <InlineSVG icon="pencil" className={ selectedAction === 'put' && styles.selectedIcon } />
          </a>
          <a onClick={() => this._handleChangeTileMethod('paint')}>
            <InlineSVG icon="drop" className={ selectedAction === 'paint' && styles.selectedIcon } />
          </a>
        </div>
        <div className="middle">
          <div>
            <div>Zoom</div>
            <input type="range" min="0" max="1" step="0.05" value={zoom} onChange={this._handleChangeZoom} />
          </div>
        </div>
        <div className="right">
          <Button onClick={this._handleOpen} className={styles.button}>
            <InlineSVG className={styles.buttonIcon} icon="upload" /> Open
          </Button>
          <Button onClick={this._handleWrite} className={styles.button}>
            <InlineSVG className={styles.buttonIcon} icon="download" /> Save
          </Button>
          <Button onClick={this._handleSettings} className={styles.button}>
            <InlineSVG className={styles.buttonIcon} icon="cog" />
          </Button>
        </div>
      </div>
    );
  }
}

export default compose(
  connect(state => ({
    selectedTile: state.global.selectedTile,
    selectedAction: state.global.selectedAction,
    zoom: state.global.zoom,
  })),
  withRouter,
)(component);
