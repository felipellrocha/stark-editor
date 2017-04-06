import { handleActions } from 'redux-actions';

import {
  RECEIVE_TILESETS,
} from 'actions';

const initialState = {
  name: 'The Lattice',
  grid: {
    rows: 5,
    columns: 10,
  },
  tile: {
    width: 32,
    height: 32,
  },
  data: [ ],
  tilesets: [ ],
};

export default handleActions({
  RECEIVE_TILESETS: (state, action) => {
    const tilesets = [...state.tilesets, ...action.tilesets];

    return Object.assign({}, state, { tilesets: tilesets });
  }
}, initialState);
