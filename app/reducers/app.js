import { handleActions } from 'redux-actions';

import { arrayReplace } from 'utils';

import {
  RECEIVE_TILESETS,
  SELECT_TILE,
  SELECT_LAYER,
  LOAD_STAGE,
} from 'actions';

const initialState = {
  name: 'Game Editor',
  filename: '/Users/fllr/game/game.targ',
  grid: {
    rows: 20,
    columns: 20,
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

initialState.layers = ['background', 'foreground'].map(name => ({
  type: 'tile',
  name: name,
  data: [...Array(initialState.grid.rows * initialState.grid.columns)].map((_, i) => [-1, 0]),
}));

export default handleActions({
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

    if (currentTile[0] == selectedTile[0] && currentTile[1] == selectedTile[1]) return state;

    const newData = arrayReplace(currentLayer.data, selectedTile, index);
    const newLayer = Object.assign({}, currentLayer, { data: newData });
    const newLayers = arrayReplace(state.layers, newLayer, selectedLayer);

    return Object.assign({}, state, { layers: newLayers });
  },
  LOAD_STAGE: (state, action) => {
    return Object.assign({}, state, action.data);
  },
}, initialState);
