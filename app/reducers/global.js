import { handleActions } from 'redux-actions';

import path from 'path';
import electron from 'electron';

import {
  SAVE_FILENAME,
} from 'actions';

const initialState = {
  filename: '',
  basepath: electron.remote.app.getPath('home'),
};

export default handleActions({
  SAVE_FILENAME: (state, action) => {
    return Object.assign({}, state, {
      filename: action.filename,
      basepath: action.newBasepath,
    });
  },
}, initialState);
