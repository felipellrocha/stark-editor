import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom'

import {
  Sidebar,
  InlineSVG,
  SelectorFooter,
} from 'components';

import {
  changeGameName,
  changeTileWidth,
  changeTileHeight,
  changeGridColumns,
  changeGridRows,
} from 'actions';

import styles from './styles.css';

class component extends PureComponent {
  constructor(props) {
    super(props);

    this._handleGoBack = this._handleGoBack.bind(this);
    this._handleChangeGameName = this._handleChangeGameName.bind(this);
    this._handleChangeTileWidth = this._handleChangeTileWidth.bind(this);
    this._handleChangeTileHeight = this._handleChangeTileHeight.bind(this);
    this._handleChangeGridColumns = this._handleChangeGridColumns.bind(this);
    this._handleChangeGridRows = this._handleChangeGridRows.bind(this);
  }

  _handleGoBack() {
    const {
      history,
    } = this.props;

    history.goBack();
  }

  _handleChangeGameName(e) {
    const {
      dispatch,
    } = this.props;

    dispatch(changeGameName(e.target.value));
  }

  _handleChangeTileWidth(e) {
    const {
      dispatch,
    } = this.props;

    dispatch(changeTileWidth(e.target.value));
  }

  _handleChangeTileHeight(e) {
    const {
      dispatch,
    } = this.props;

    dispatch(changeTileHeight(e.target.value));
  }

  _handleChangeGridColumns(e) {
    const {
      dispatch,
    } = this.props;

    dispatch(changeGridColumns(e.target.value));
  }

  _handleChangeGridRows(e) {
    const {
      dispatch,
    } = this.props;

    dispatch(changeGridRows(e.target.value));
  }

  render() {
    const {
      gameName,
      tile,
      grid,
    } = this.props;

    return (
      <div>
        <Sidebar />
        <div className={styles.component} >
          <h3>
            <span>Settings</span>
            <InlineSVG className="close" icon="cross" onClick={this._handleGoBack} />
          </h3>
          <div className="form">
            <div className="input">
              <label>Game Name</label>
              <input type="text" value={ gameName } onChange={this._handleChangeGameName} />
            </div>
            <div className="input">
              <label>Grid (this is a destructive action)</label>
            </div>
            <div className="input-row">
              <div className="input">
                <label>Columns</label>
                <input type="number" value={ grid.columns } onChange={this._handleChangeGridColumns} />
              </div>
              <div className="input">
                <label>Rows</label>
                <input type="number" value={ grid.rows } onChange={this._handleChangeGridRows} />
              </div>
            </div>
            <div className="input">
              <label>Tiles</label>
            </div>
            <div className="input-row">
              <div className="input">
                <label>Width</label>
                <input type="number" value={ tile.width } onChange={this._handleChangeTileWidth} />
              </div>
              <div className="input">
                <label>Height</label>
                <input type="number" value={ tile.height } onChange={this._handleChangeTileHeight} />
              </div>
            </div>
          </div>
        </div>
        <SelectorFooter />
      </div>
    );
  }
}

export default compose(
  connect(state => ({
    gameName: state.app.name,
    tile: state.app.tile,
    grid: state.app.grid,
  })),
  withRouter,
)(component);
