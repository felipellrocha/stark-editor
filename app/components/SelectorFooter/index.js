import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom'

import {
  EMPTY,
} from 'utils/constants';

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
  toggleHideGrid,
} from 'actions';

import styles from './styles.css';

class component extends PureComponent {
  constructor(props) {
    super(props);

    this.handleClear = this.handleClear.bind(this);
    this.handleChangeZoom = this.handleChangeZoom.bind(this);
    this.handleChangeTileMethod = this.handleChangeTileMethod.bind(this);
    this.handleGrid = this.handleGrid.bind(this);
  }

  handleGrid() {
    const {
      dispatch,
    } = this.props;

    dispatch(toggleHideGrid());
  }

  handleChangeTileMethod(value) {
    const {
      dispatch,
    } = this.props;

    dispatch(changeTilingMethod(value));
  }

  handleChangeZoom(e) {
    const {
      dispatch,
    } = this.props;

    dispatch(changeZoom(e.target.value));
  }

  handleClear() {
    const {
      dispatch,
    } = this.props;

    dispatch(selectTile({setIndex: EMPTY, tileIndex: 0}));
  }

  render() {
    const {
      selectedTile: [
        setIndex,
        tileIndex,
      ],
      hideGrid,
      zoom,
      selectedAction,
      className,
    } = this.props;

    const classes = classnames(styles.component, className);

    return (
      <div className={classes}>
        <div className="left">
          <Tile setIndex={setIndex} tileIndex={tileIndex} className={styles.tile} />
          <div className="clear" onClick={this.handleClear}>
            <InlineSVG className={styles.icon} icon="cross" /> Clear tile selection
          </div>
          <div className="clear" onClick={this.handleGrid}>
            <InlineSVG className={ hideGrid && styles.selectedIcon } icon="page-break" />
            {hideGrid ? 'Show' : 'Hide' } grid
          </div>
        </div>
        <div className="middle">
          <div>
            <div>Zoom</div>
            <input type="range" min="0" max="1" step="0.05" value={zoom} onChange={this.handleChangeZoom} />
          </div>
        </div>
        <div className="right">
          <a onClick={() => this.handleChangeTileMethod('put')}>
            <InlineSVG icon="pencil" className={ selectedAction === 'put' && styles.selectedIcon } />
          </a>
          <a onClick={() => this.handleChangeTileMethod('paint')}>
            <InlineSVG icon="drop" className={ selectedAction === 'paint' && styles.selectedIcon } />
          </a>
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
    hideGrid: state.global.hideGrid,
  })),
  withRouter,
)(component);
