import { handleActions } from 'redux-actions';

import path from 'path';

import {
  CHANGE_GAME_NAME,
  ADD_TERRAIN,
  RECEIVE_TILESETS,
  CHANGE_TILESET_NAME,
  CHANGE_TILE_WIDTH,
  CHANGE_TILE_HEIGHT,
  PAINT_TILE,
  LOAD_STAGE,
  SAVE_FILENAME,
  TOGGLE_LAYER_VISIBILITY,
  REMOVE_LAYER,
} from 'actions';

import {
  arrayReplace,
  arrayRemove,
  flood,
} from 'utils';

const initialState = {
  name: 'Untitled',
  grid: {
    columns: 10,
    rows: 10,
  },
  tile: {
    width: 48,
    height: 48,
  },
  layers: [ ],
  tilesets: [ ],
  terrains: [ ],
};

initialState.layers = ['background', 'middleground', 'foreground'].map(name => ({
  type: 'tile',
  name: name,
  visible: true,
  data: [...Array(initialState.grid.rows * initialState.grid.columns)].map((_, i) => [-1, 0]),
}));

export default handleActions({
  CHANGE_TILE_WIDTH: (state, action) => {
    const newTile = Object.assign({}, state.tile, { width: action.value });
    return Object.assign({}, state, { tile: newTile});
  },
  CHANGE_TILE_HEIGHT: (state, action) => {
    const newTile = Object.assign({}, state.tile, { height: action.value });
    return Object.assign({}, state, { tile: newTile});
  },
  CHANGE_GAME_NAME: (state, action) => {
    return Object.assign({}, state, { name: action.name });
  },
  ADD_TERRAIN: (state, action) => {
    const {
      setIndex,
      tileIndex,
      terrainType,
    } = action;

    const {
      tilesets,
    } = state;

    const tileset = tilesets[setIndex];

    const terrains = Object.assign({}, tileset.terrains, { [tileIndex]: {
      type: terrainType,
    }});

    const newTileset = Object.assign({}, tileset, { terrains });
    const newTilesets = arrayReplace(state.tilesets, newTileset, setIndex);

    return Object.assign({}, state, { tilesets: newTilesets });
  },
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
  TOGGLE_LAYER_VISIBILITY: (state, action) => {
    const layer = state.layers[action.layer];
    const newLayer = Object.assign({}, layer, { visible: !layer.visible });
    const newLayers = arrayReplace(state.layers, newLayer, action.layer);

    return Object.assign({}, state, { layers: newLayers });
  },
  REMOVE_LAYER: (state, action) => {
    const newLayers = arrayRemove(state.layers, action.layer);
    
    return Object.assign({}, state, { layers: newLayers });
  },
  PAINT_TILE: (state, action) => {
    const {
      tile: {
        x,
        y,
      },
      layer,
    } = action;

    const {
      layers,
      grid,
      selectedTile,
    } = state;

    const index = (grid.columns * y) + x;

    const currentLayer = layers[layer];
    const currentTile = currentLayer.data[index];

    const newData = [...currentLayer.data];
    flood(x, y, selectedTile, currentTile, newData, grid);

    const newLayer = Object.assign({}, currentLayer, { data: newData });
    const newLayers = arrayReplace(state.layers, newLayer, layer);

    return Object.assign({}, state, { layers: newLayers });
  },
  PUT_DOWN_TILE: (state, action) => {
    const {
      tile: {
        x,
        y,
      },
      layer,
      selectedTile,
    } = action;

    const {
      layers,
      grid,
    } = state;

    const index = (grid.columns * y) + x;

    const currentLayer = layers[layer];
    const currentTile = currentLayer.data[index];

    if (currentTile[0] === selectedTile[0] && currentTile[1] === selectedTile[1]) { return state };

    const newData = arrayReplace(currentLayer.data, selectedTile, index);
    const newLayer = Object.assign({}, currentLayer, { data: newData });
    const newLayers = arrayReplace(state.layers, newLayer, layer);

    return Object.assign({}, state, { layers: newLayers });
  },
  LOAD_STAGE: (state, action) => {
    return Object.assign({}, state, action.data);
  },
}, initialState);
