import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import classnames from 'classnames';
import { withRouter } from 'react-router-dom'

import { memoize } from 'lodash';

import {
  selectTilesets,
  selectTile,
  selectLayer,
  toggleLayerVisibility,
  removeLayer,
  viewTilesetEditor,
} from 'actions';

import {
  InlineSVG,
  Button,
  Grid,
} from 'components';

import styles from './styles.css';

class component extends PureComponent {
  constructor(props) {
    super(props);

    this._handleSelectTiles = this._handleSelectTiles.bind(this);
    this._handleSelectLayer = this._handleSelectLayer.bind(this);
    this._handleViewTilesetEditor = this._handleViewTilesetEditor.bind(this);
    this._renderSimpleGrid = this._renderSimpleGrid.bind(this);
    this._renderTerrainGrid = this._renderTerrainGrid.bind(this);
    this._handleToggleVisibility = this._handleToggleVisibility.bind(this);
    this._handleRemoveLayer = this._handleRemoveLayer.bind(this);
  }

  _handleSelectLayer(layer) {
    const {
      dispatch,
    } = this.props;

    dispatch(selectLayer(layer));
  }

  _handleRemoveLayer(layer) {
    const {
      dispatch,
    } = this.props;

    dispatch(removeLayer(layer));
  }

  _handleToggleVisibility(layer) {
    const {
      dispatch,
    } = this.props;

    dispatch(toggleLayerVisibility(layer));
  }

  _handleSelectTiles() {
    const {
      dispatch,
      history,
    } = this.props;

    dispatch(selectTilesets(history));
  }

  _handleViewTilesetEditor() {
    const {
      dispatch,
      history,
    } = this.props;

    dispatch(viewTilesetEditor(history));
  }

  _renderSimpleGrid(tileset, index) {
    const {
      rows,
      columns,
      src,
      name,
    } = tileset;

    const [
      data,
      grid,
    ] = _getGridData(tileset, rows, columns, index);

    const key = `${rows}_${columns}_${index}`

    return (
      <div key={key}>
        <h3>{ name }</h3>
        <Grid
          data={data}
          grid={grid}
          tileAction={selectTile}
          simpleTiles
        />
      </div>
    );
  }

  _renderTerrainGrid(tileset, index) {
    const {
      rows,
      columns,
      src,
      name,
    } = tileset;

    const [
      data,
      grid,
    ] = _getTerrainData(tileset, 4, index);

    const key = `${rows}_${columns}_${index}`

    return (
      <div key={key}>
        <h3>{ name }</h3>
        <Grid
          data={data}
          grid={grid}
          tileAction={selectTile}
          simpleTiles
        />
      </div>
    );
  }

  render() {
    const {
      name,
      tilesets,
      layers,
      selectedLayer,
    } = this.props;

    return (
      <div className={styles.component}>
        <h1>{ name }</h1>
        <div className="separator">
          {layers.map((layer, i) => {
            const classes = classnames('layer', {
              'selected': selectedLayer === i,
              'not-visible': !layer.visible,
            });

            return (
              <div
                key={ layer.name }
                className={classes}
                onClick={() => this._handleSelectLayer(i)}
              >
                <div>{ layer.name }</div>
                <div className="actions">
                  <InlineSVG icon='cog' />
                  <InlineSVG icon='eye' onClick={() => this._handleToggleVisibility(i)} />
                  <InlineSVG icon='cross' onClick={() => this._handleRemoveLayer(i)} />
                </div>
              </div>
            )
          })}
        </div>
        <div className="actions separator">
          <Button onClick={this._handleSelectTiles}>
            Add tilesets
          </Button>
          <Button onClick={this._handleViewTilesetEditor}>
            View Tileset Editor
          </Button>
        </div>
        <div className="tilesets separator">
          <div className="simple">
            { tilesets.map((tileset, index) => {
              if (tileset.type !== 'aware') return this._renderSimpleGrid(tileset, index)
            })}
          </div>
          <div className="terrains">
            { tilesets.map((tileset, index) => {
              if (tileset.type === 'aware') return this._renderTerrainGrid(tileset, index)
            })}
          </div>
        </div>
      </div>
    );
  }
}

const _getGridData = memoize(function(tileset, rows, columns, index) {
  return [
    [...Array(rows * columns)].map((_, i) => [index, i]),
    { rows, columns },
  ];
});

const _getTerrainData = memoize(function(tileset, columns, setIndex) {
  const terrains = Object.keys(tileset.terrains);
  const rows = Math.ceil(terrains.length / columns);

  return [
    [...Array(terrains.length)].map((_, i) => [setIndex, terrains[i]]),
    { rows, columns },
  ];
});

export default compose(
  connect(state => ({
    name: state.app.name,
    tilesets: state.app.tilesets,
    layers: state.app.layers,
    selectedLayer: state.global.selectedLayer,
    basepath: state.app.basepath,
  })),
  withRouter,
)(component);
