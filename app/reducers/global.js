import { handleActions } from 'redux-actions';

import path from 'path';
import electron from 'electron';

import {
  SAVE_FILENAME,
  LOAD_STAGE,
  UPDATE_PATHS,
  CHANGE_ZOOM,
  CHANGE_TILING_METHOD,
} from 'actions';

const initialState = {
  filename: '',
  basepath: electron.remote.app.getPath('home'),
  zoom: .5,
  selectedAction: 'put',
};

export default handleActions({
  CHANGE_TILING_METHOD: (state, action) => {
    return Object.assign({}, state, { selectedAction: action.method });
  },
  CHANGE_ZOOM: (state, action) => {
    return Object.assign({}, state, { zoom: action.zoom });
  },
  UPDATE_PATHS: (state, action) => {
    return Object.assign({}, state, {
      filename: action.filename,
      basepath: action.basepath,
    });
  },
  SAVE_FILENAME: (state, action) => {
    return Object.assign({}, state, {
      filename: action.filename,
      basepath: action.newBasepath,
    });
  },
}, initialState);
