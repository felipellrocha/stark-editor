import { handleActions } from 'redux-actions';

import { arrayReplace } from 'utils';

import {
  RECEIVE_TILESETS,
  PAINT_TILE,
  SELECT_TILE,
  SELECT_LAYER,
  LOAD_STAGE,
  CHANGE_ZOOM,
  CHANGE_TILING_METHOD,
} from 'actions';

import {
  flood,
} from 'utils';

const initialState = {
  name: 'Game Editor',
  filename: '/Users/fllr/game/game.targ',
  zoom: .5,
  grid: {
    columns: 20,
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
  selectedAction: 'put',
};

initialState.layers = ['background', 'foreground'].map(name => ({
  type: 'tile',
  name: name,
  data: [...Array(initialState.grid.rows * initialState.grid.columns)].map((_, i) => [-1, 0]),
}));

export default handleActions({
  CHANGE_TILING_METHOD: (state, action) => {
    return Object.assign({}, state, { selectedAction: action.method });
  },
  CHANGE_ZOOM: (state, action) => {
    return Object.assign({}, state, { zoom: action.zoom });
  },
  RECEIVE_TILESETS: (state, action) => {
    const tilesets = [...state.tilesets, ...action.tilesets];

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
