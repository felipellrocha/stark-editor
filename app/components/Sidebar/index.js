import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import classnames from 'classnames';
import { withRouter } from 'react-router-dom'

import { memoize } from 'lodash';

import {
  EMPTY,
  ENTITY,
} from 'utils/constants';

import {
  IndexToXY,
  XYToIndex,
} from 'utils';

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
  receiveTileSelection,
} from 'actions';

import {
  InlineSVG,
  Button,
  Grid,
} from 'components';

import styles from './styles.css';

function noop () { }

class component extends PureComponent {
  constructor(props) {
    super(props);

    this.handleMoveLayerUp = this.handleMoveLayerUp.bind(this);
    this.handleMoveLayerDown = this.handleMoveLayerDown.bind(this);
    this.handleAddLayer = this.handleAddLayer.bind(this);
    this.handleChangeLayerName = this.handleChangeLayerName.bind(this);
    this.handleSelectTiles = this.handleSelectTiles.bind(this);
    this.handleSelectLayer = this.handleSelectLayer.bind(this);
    this.handleViewTilesetEditor = this.handleViewTilesetEditor.bind(this);
    this.renderSimpleGrid = this.renderSimpleGrid.bind(this);
    this.renderEntityGrid = this.renderEntityGrid.bind(this);
    this.renderTerrainGrid = this.renderTerrainGrid.bind(this);
    this.handleToggleVisibility = this.handleToggleVisibility.bind(this);
    this.handleRemoveLayer = this.handleRemoveLayer.bind(this);

    this.handleSelectTile = this.handleSelectTile.bind(this)
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);

    this.state = {
      initialIndex: 0,
      selecting: false,
    };
  }

  handleAddLayer() {
    const {
      dispatch,
    } = this.props;

    dispatch(addLayer());
  }

  handleMoveLayerUp(layer) {
    const {
      dispatch,
    } = this.props;

    dispatch(moveLayerUp(layer));
  }

  handleMoveLayerDown(layer) {
    const {
      dispatch,
    } = this.props;

    dispatch(moveLayerDown(layer));
  }

  handleChangeLayerName(layer, event) {
    const {
      dispatch,
    } = this.props;

    dispatch(changeLayerName(layer, event.target.value));
  }

  handleSelectLayer(layer) {
    const {
      dispatch,
    } = this.props;

    dispatch(selectLayer(layer));
  }

  handleRemoveLayer(layer) {
    const {
      dispatch,
    } = this.props;

    dispatch(removeLayer(layer));
  }

  handleToggleVisibility(layer) {
    const {
      dispatch,
    } = this.props;

    dispatch(toggleLayerVisibility(layer));
  }

  handleSelectTiles() {
    const {
      dispatch,
      history,
    } = this.props;

    dispatch(selectTilesets(history));
  }

  handleViewTilesetEditor() {
    const {
      dispatch,
      history,
    } = this.props;

    dispatch(viewTilesetEditor(history));
  }

  handleMouseDown(e, layer, grid) {
    const {
      dispatch,
      tile,
    } = this.props;

    const {
      offsetX: x,
      offsetY: y,
    } = e.nativeEvent;

    const index = XYToIndex(
      Math.floor(x / tile.width),
      Math.floor(y / tile.height),
      grid
    );

    this.setState({
      selecting: true,
    });

    dispatch(receiveTileSelection(index, layer, grid, index));
  }

  handleMouseUp() {
    this.setState({
      selecting: false,
    });
  }

  handleSelectTile(e, layer, grid) {
    if (!this.state.selecting && e.type !== 'click') { return }

    const {
      dispatch,
      tile,
    } = this.props;

    const {
      offsetX: x,
      offsetY: y,
    } = e.nativeEvent;

    const index = XYToIndex(
      Math.floor(x / tile.width),
      Math.floor(y / tile.height),
      grid
    );

    const selection = {
      setIndex: layer,
      tileIndex: index,
    };

    dispatch(receiveTileSelection(index, layer, grid));
  }

  renderSimpleGrid(tileset, index) {
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
          className={styles.cancelEvents}
          simpleTiles
          selectorGrid

          onMouseMove={event => this.handleSelectTile(event, index, tileset)}
          onMouseDown={event => this.handleMouseDown(event, index, tileset)}
          onMouseUp={this.handleMouseUp}
          onDragStart={noop}
          onDrop={noop}
        />
      </div>
    );
  }

  renderEntityGrid() {
    const {
      entities,
    } = this.props;

    const [
      data,
      grid,
    ] = _getEntityData(entities, 4);

    return (
      <div key='entity-grid'>
        <Grid
          data={data}
          grid={grid}
          tileAction={selectTile}
        />
      </div>
    );
  }

  renderTerrainGrid(tileset, index) {
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
      maps,
      tile,
      entities,
      tilesets,
      layers,
      selectedLayer,
      selectedMap,
    } = this.props;

    const map = maps[selectedMap];

    return (
      <div className={styles.component}>
        <h1>{ name }</h1>
        <h2>{ map.name }</h2>
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
                onClick={() => this.handleSelectLayer(i)}
              >
                <input
                  onChange={event => this.handleChangeLayerName(i, event)}
                  value={ layer.name }
                />
                <div className="actions">
                  {i !== 0
                    ? <InlineSVG icon='arrow-up' className="action" onClick={() => this.handleMoveLayerUp(i)} />
                    : <div className="action" />}
                  {i !== layers.length - 1 
                    ? <InlineSVG icon='arrow-down' className="action" onClick={() => this.handleMoveLayerDown(i)} />
                    : <div className="action" />}
                  <InlineSVG icon='eye' className="action" onClick={() => this.handleToggleVisibility(i)} />
                  <InlineSVG icon='cross' className="action" onClick={() => this.handleRemoveLayer(i)} />
                </div>
              </div>
            )
          })}
          <div className="layer add" onClick={this.handleAddLayer}>
            <div>Add another layer</div>
            <InlineSVG icon="plus-circle" />
          </div>
        </div>
        <div className="actions separator">
          <Button onClick={this.handleSelectTiles}>
            Add tilesets
          </Button>
          <Button onClick={this.handleViewTilesetEditor}>
            View Tileset Editor
          </Button>
        </div>
        <div className="tilesets separator">
          <div className="entities">
            <h4>Entities</h4>
            {this.renderEntityGrid()}
          </div>
          <div className="simple">
            <h4>Tile</h4>
            { tilesets.map((tileset, index) => {
              if (tileset.type !== 'aware') return this.renderSimpleGrid(tileset, index)
            })}
          </div>
          <div className="terrains">
            <h4>Terrains</h4>
            { tilesets.map((tileset, index) => {
              if (tileset.type === 'aware') return this.renderTerrainGrid(tileset, index)
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

const _getEntityData = memoize(function(entities, columns) {
  const keys = Object.keys(entities);
  const rows = Math.ceil(keys.length / columns);

  return [
    keys.map(id => [ENTITY, id]),
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
    maps: state.app.maps,
    tile: state.app.tile,
    entities: state.app.entities,
    tilesets: state.app.tilesets,
    basepath: state.app.basepath,

    layers: state.tilemap.layers,

    selectedLayer: state.global.selectedLayer,
    selectedMap: state.global.selectedMap,
  })),
  withRouter,
)(component);
