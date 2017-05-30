import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import classnames from 'classnames';
import { withRouter } from 'react-router-dom'

import { memoize } from 'lodash';

import {
  selectTilesets,
  selectTile,
  changeLayerName,
  addLayer,
  moveLayerUp,
  moveLayerDown,
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

    this._handleMoveLayerUp = this._handleMoveLayerUp.bind(this);
    this._handleMoveLayerDown = this._handleMoveLayerDown.bind(this);
    this._handleAddLayer = this._handleAddLayer.bind(this);
    this._handleChangeLayerName = this._handleChangeLayerName.bind(this);
    this._handleSelectTiles = this._handleSelectTiles.bind(this);
    this._handleSelectLayer = this._handleSelectLayer.bind(this);
    this._handleViewTilesetEditor = this._handleViewTilesetEditor.bind(this);
    this._renderSimpleGrid = this._renderSimpleGrid.bind(this);
    this._renderTerrainGrid = this._renderTerrainGrid.bind(this);
    this._handleToggleVisibility = this._handleToggleVisibility.bind(this);
    this._handleRemoveLayer = this._handleRemoveLayer.bind(this);
  }

  _handleAddLayer() {
    const {
      dispatch,
    } = this.props;

    dispatch(addLayer());
  }

  _handleMoveLayerUp(layer) {
    const {
      dispatch,
    } = this.props;

    dispatch(moveLayerUp(layer));
  }

  _handleMoveLayerDown(layer) {
    const {
      dispatch,
    } = this.props;

    dispatch(moveLayerDown(layer));
  }

  _handleChangeLayerName(layer, event) {
    const {
      dispatch,
    } = this.props;

    dispatch(changeLayerName(layer, event.target.value));
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
        <h2></h2>
        <div className="separator">
          {layers.map((layer, i) => {
            const classes = classnames('layer', {
              'selected': selectedLayer === i,
              'not-visible': !layer.visible,
            });

            return (
              <div
                key={ layer.id }
                className={classes}
                onClick={() => this._handleSelectLayer(i)}
              >
                <input
                  onChange={event => this._handleChangeLayerName(i, event)}
                  value={ layer.name }
                />
                <div className="actions">
                  {i !== 0
                    ? <InlineSVG icon='arrow-up' className="action" onClick={() => this._handleMoveLayerUp(i)} />
                    : <div className="action" />}
                  {i !== layers.length - 1 
                    ? <InlineSVG icon='arrow-down' className="action" onClick={() => this._handleMoveLayerDown(i)} />
                    : <div className="action" />}
                  <InlineSVG icon='eye' className="action" onClick={() => this._handleToggleVisibility(i)} />
                  <InlineSVG icon='cross' className="action" onClick={() => this._handleRemoveLayer(i)} />
                </div>
              </div>
            )
          })}
          <div className="layer add" onClick={this._handleAddLayer}>
            <div>Add another layer</div>
            <InlineSVG icon="plus-circle" />
          </div>
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
    layers: state.tilemap.layers,
    selectedLayer: state.global.selectedLayer,
    basepath: state.app.basepath,
  })),
  withRouter,
)(component);
