import { handleActions } from 'redux-actions';

import { arrayReplace } from 'utils';

import path from 'path';

import {
  RECEIVE_TILESETS,
  CHANGE_TILESET_NAME,
  PAINT_TILE,
  SELECT_TILE,
  SELECT_LAYER,
  LOAD_STAGE,
  SAVE_FILENAME,
} from 'actions';

import {
  flood,
} from 'utils';

const initialState = {
  name: 'Game Editor',
  grid: {
    columns: 10,
    rows: 10,
  },
  tile: {
    width: 48,
    height: 48,
  },
  layers: [],
  tilesets: [ ],
  selectedTile: [-1, 0],
  selectedLayer: 0,
};

initialState.layers = ['background', 'middleground', 'foreground'].map(name => ({
  type: 'tile',
  name: name,
  data: [...Array(initialState.grid.rows * initialState.grid.columns)].map((_, i) => [-1, 0]),
}));

export default handleActions({
  RECEIVE_TILESETS: (state, action) => {
    const tilesets = [...state.tilesets, ...action.tilesets];

    return Object.assign({}, state, { tilesets: tilesets });
  },
  CHANGE_TILESET_TYPE: (state, action) => {
    const {
      index,
      tilesetType: type,
    } = action;

    const tileset = state.tilesets[index];
    
    const newTileset = Object.assign({}, tileset, { type });
    const newTilesets = arrayReplace(state.tilesets, newTileset, index);

    return Object.assign({}, state, { tilesets: newTilesets });
  },
  CHANGE_TILESET_NAME: (state, action) => {
    const {
      index,
      name,
    } = action;

    const tileset = state.tilesets[index];
    
    const newTileset = Object.assign({}, tileset, { name });
    const newTilesets = arrayReplace(state.tilesets, newTileset, index);

    return Object.assign({}, state, { tilesets: newTilesets });
  },
  SAVE_FILENAME: (state, action) => {
    const tilesets = state.tilesets.map(tileset => {
      const resolve = path.resolve(action.oldBasepath, tileset.src);
      const src = path.relative(action.newBasepath, resolve);

      return Object.assign({}, tileset, {
        src,
      });
    });

    return Object.assign({}, state, { tilesets: tilesets });
  },
  SELECT_LAYER: (state, action) => {
    return Object.assign({}, state, { selectedLayer: action.layer });
  },
  SELECT_TILE: (state, action) => {
    return Object.assign({}, state, { selectedTile: action.tile });
  },
  PAINT_TILE: (state, action) => {
    const {
      tile: {
        x,
        y,
      }
    } = action;

    const {
      layers,
      grid,
      selectedTile,
      selectedLayer,
    } = state;

    const index = (grid.columns * y) + x;

    const currentLayer = layers[selectedLayer];
    const currentTile = currentLayer.data[index];

    const newData = [...currentLayer.data];
    flood(x, y, selectedTile, currentTile, newData, grid);

    const newLayer = Object.assign({}, currentLayer, { data: newData });
    const newLayers = arrayReplace(state.layers, newLayer, selectedLayer);

    return Object.assign({}, state, { layers: newLayers });
  },
  PUT_DOWN_TILE: (state, action) => {
    const {
      tile: {
        x,
        y,
      }
    } = action;

    const {
      layers,
      grid,
      selectedTile,
      selectedLayer,
    } = state;

    const index = (grid.columns * y) + x;

    const currentLayer = layers[selectedLayer];
    const currentTile = currentLayer.data[index];

    if (currentTile[0] === selectedTile[0] && currentTile[1] === selectedTile[1]) { return state };

    const newData = arrayReplace(currentLayer.data, selectedTile, index);
    const newLayer = Object.assign({}, currentLayer, { data: newData });
    const newLayers = arrayReplace(state.layers, newLayer, selectedLayer);

    return Object.assign({}, state, { layers: newLayers });
  },
  LOAD_STAGE: (state, action) => {
    return Object.assign({}, state, action.data);
  },
}, initialState);
