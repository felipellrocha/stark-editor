import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import path from 'path';

import classnames from 'classnames';

import {
  XYToIndex,
  IndexToXY,
  areCoordinatesInside,
  compareCoordinates,
  sixTile,
  fourTile,
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

    const tilingPackage = (terrain.type === '6-tile') ? sixTile : fourTile;
    
    return (
      <div className={classes} style={style} onClick={this._dispatchAction}>
        { this.renderSubTile(left, top, src, tilingPackage.northWestOffset(directions)) }
        { this.renderSubTile(left, top, src, tilingPackage.northEastOffset(directions)) }
        { this.renderSubTile(left, top, src, tilingPackage.southWestOffset(directions)) }
        { this.renderSubTile(left, top, src, tilingPackage.southEastOffset(directions)) }
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

export default connect(
  (state, props) => ({
    tile: state.app.tile,
    tilesets: state.app.tilesets,
    basepath: state.global.basepath,
  }),
)(component);
