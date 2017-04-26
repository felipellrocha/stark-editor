import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import path from 'path';

import classnames from 'classnames';

import {
  XYToIndex,
  IndexToXY,
  areCoordinatesInside,
  compareCoordinates,
} from 'utils';

import styles from './styles.css';

class component extends PureComponent {
  constructor(props) {
    super(props);

    this._dispatchAction = this._dispatchAction.bind(this);
    this.renderEmptyTile = this.renderEmptyTile.bind(this);
    this.renderSimpleTile = this.renderSimpleTile.bind(this);
    this.renderSubTile = this.renderSubTile.bind(this);
  }

  _dispatchAction() {
    const {
      setIndex,
      tileIndex,
      x,
      y,
      dispatch,
    } = this.props;

    if (this.props.tileAction)
      dispatch(this.props.tileAction({
        setIndex,
        tileIndex,
        x,
        y,
      }));
  }

  renderAwareTile() {
    const {
      tile,
      tilesets,
      setIndex,
      tileIndex,
      grid,
      x,
      y,
      className,
      basepath,
      data,
    } = this.props;

    const classes = classnames(styles.component, className);

    const tileset = tilesets[setIndex];
    const terrain = tileset.terrains[tileIndex];

    const left = (tileIndex % tileset.columns) * tile.width;
    const top = Math.floor(tileIndex / tileset.columns) * tile.height;
    const src = path.resolve(basepath, tileset.src)

    const style = {
      height: tile.height,
      width: tile.width,
      display: 'flex',
      flexWrap: 'wrap',
    };

    const directions = {
      isNorth: areCoordinatesInside(x, y - 1, grid) && compareCoordinates([x, y], [x, y - 1], data, grid),
      isNorthEast: areCoordinatesInside(x + 1, y - 1, grid) && compareCoordinates([x, y], [x + 1, y - 1], data, grid),
      isEast: areCoordinatesInside(x + 1, y, grid) && compareCoordinates([x, y], [x + 1, y], data, grid),
      isSouthEast: areCoordinatesInside(x + 1, y + 1, grid) && compareCoordinates([x, y], [x + 1, y + 1], data, grid),
      isSouth: areCoordinatesInside(x, y + 1, grid) && compareCoordinates([x, y], [x, y + 1], data, grid),
      isSouthWest: areCoordinatesInside(x - 1, y + 1, grid) && compareCoordinates([x, y], [x - 1, y + 1], data, grid),
      isWest: areCoordinatesInside(x - 1, y, grid) && compareCoordinates([x, y], [x - 1, y], data, grid),
      isNorthWest: areCoordinatesInside(x - 1, y - 1, grid) && compareCoordinates([x, y], [x - 1, y - 1], data, grid),
    };
    
    return (
      <div className={classes} style={style} onClick={this._dispatchAction}>
        { this.renderSubTile(left, top, src, northWestOffset(directions, terrain)) }
        { this.renderSubTile(left, top, src, northEastOffset(directions, terrain)) }
        { this.renderSubTile(left, top, src, southWestOffset(directions, terrain)) }
        { this.renderSubTile(left, top, src, southEastOffset(directions, terrain)) }
      </div>
    )
  }

  renderSubTile(left, top, src, offset) {
    const {
      tile,
      tilesets,
      setIndex,
    } = this.props;

    const x = offset[0] * (tile.width / 2);
    const y = offset[1] * (tile.height / 2);

    const tileset = tilesets[setIndex];

    const style = {
      height: tile.height / 2,
      width: tile.width / 2,
      backgroundImage: `url('file://${src}')`,
      backgroundPosition: `-${left}px -${top + y}px`,
      backgroundPosition: `-${left + x}px -${top + y}px`,
    };

    return (
      <div style={style} />
    )
  }


  renderSimpleTile() {
    const {
      tile,
      tilesets,
      setIndex,
      tileIndex,
      grid,
      className,
      basepath,
    } = this.props;

    const classes = classnames(styles.component, className);

    const tileset = tilesets[setIndex];

    const left = (tileIndex % tileset.columns) * tile.width;
    const top = Math.floor(tileIndex / tileset.columns) * tile.height;
    const src = path.resolve(basepath, tileset.src)

    const style = {
      height: tile.height,
      width: tile.width,
      backgroundImage: `url('file://${src}')`,
      backgroundPosition: `-${left}px -${top}px`,
    };

    
    return (
      <div className={classes} style={style} onClick={this._dispatchAction} />
    )
  }

  renderEmptyTile() {
    const {
      className,
      tile,
    } = this.props;

    const style = {
      height: tile.height,
      width: tile.width,
    };

    const classes = classnames(styles.component, className);

    return (
      <div className={classes} style={style} onClick={this._dispatchAction} />
    )
  }

  render() {
    const {
      setIndex,
      tileIndex,
      tilesets,
      simpleTile,
    } = this.props;

    if (setIndex == -1) return this.renderEmptyTile();

    const tileset = tilesets[setIndex];

    if (simpleTile || tileset.type === 'tile') return this.renderSimpleTile();
    if (tileset.type === 'aware') return this.renderAwareTile();
  }
}

function southWestOffset(directions, terrain) {
  const {
    isNorth,
    isSouth,
    isWest,
    isEast,

    isSouthWest,
  } = directions;

  if (isSouth && isWest) {
    if (!isSouthWest) return [2, 1];
    else return [1, 4];
  }

  if (isSouth && !isWest) return [0, 4];
  if (!isSouth && isWest) return [1, 5];

  if (!isSouth && !isWest) return [0, 5];
}

function southEastOffset(directions, terrain) {
  const {
    isNorth,
    isSouth,
    isWest,
    isEast,

    isSouthEast,
  } = directions;

  if (isSouth && isEast) {
    if (!isSouthEast) return [3, 1];
    else return [2, 4];
  }

  if (isSouth && !isEast) return [3, 4];
  if (!isSouth && isEast) return [2, 5];

  if (!isSouth && !isEast) return [3, 5];
}

function northWestOffset(directions, terrain) {
  const {
    isNorth,
    isSouth,
    isWest,
    isEast,
    
    isNorthWest,
  } = directions;

  if (isNorth && isWest) {
    if (!isNorthWest) return [2, 0];
    else return [1, 3];
  }

  if (isNorth && !isWest) return [0, 3];
  if (!isNorth && isWest) return [1, 2];

  if (!isNorth && !isWest) return [0, 2];
}

function northEastOffset(directions, terrain) {
  const {
    isNorth,
    isSouth,
    isWest,
    isEast,

    isNorthEast,
  } = directions;

  if (isNorth && isEast) {
    if (!isNorthEast) return [3, 0];
    else return [2, 3];
  }

  if (isNorth && !isEast) return [3, 3];
  if (!isNorth && isEast) return [2, 2];

  if (!isNorth && !isEast) return [3, 2];
}

export default connect(
  (state, props) => ({
    tile: state.app.tile,
    tilesets: state.app.tilesets,
    basepath: state.global.basepath,
  }),
)(component);
