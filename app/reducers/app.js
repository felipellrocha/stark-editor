import { handleActions } from 'redux-actions';

import {
  RECEIVE_TILESETS,
  SELECT_TILE,
} from 'actions';

const initialState = {
  name: 'Game Editor',
  grid: {
    rows: 5,
    columns: 10,
  },
  tile: {
    width: 32,
    height: 32,
  },
  data: [...Array(50)].map((_, i) => [-1, i]),
  tilesets: [ ],
  selectedTile: [-1, 0],
};

export default handleActions({
  RECEIVE_TILESETS: (state, action) => {
    const tilesets = [...state.tilesets, ...action.tilesets];

    return Object.assign({}, state, { tilesets: tilesets });
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
      data,
      grid,
      selectedTile,
    } = state;

    const index = (grid.columns * y) + x;

    const newData = [
      ...data.slice(0, index),
      selectedTile,
      ...data.slice(index + 1, data.length)
    ];

    return Object.assign({}, state, { data: newData });
  },
}, initialState);
