import { handleActions } from 'redux-actions';

import path from 'path';
import electron from 'electron';

import {
  SAVE_FILENAME,
  LOAD_STAGE,
  UPDATE_PATHS,
  CHANGE_ZOOM,
  CHANGE_TILING_METHOD,
  CHANGE_TERRAIN,
  SELECT_TILE,
  SELECT_LAYER,
  SELECT_ANIMATION,
  SELECT_FRAME,
} from 'actions';

const initialState = {
  filename: '',
  basepath: electron.remote.app.getPath('home'),
  zoom: .5,
  selectedMap: 'start',
  selectedAction: 'put',
  selectedTerrainType: '6-tile',
  selectedTile: [-1, 0],
  selectedLayer: 0,
  selectedAnimation: null,
  selectedFrame: 0,
};

export default handleActions({
  SELECT_FRAME: (state, action) => {
    return {
      ...state,
      selectedFrame: action.index
    };
  },
  SELECT_ANIMATION: (state, action) => {
    return {
      ...state,
      selectedAnimation: action.name
    };
  },
  SELECT_LAYER: (state, action) => {
    return Object.assign({}, state, { selectedLayer: action.layer });
  },
  SELECT_TILE: (state, action) => {
    return Object.assign({}, state, { selectedTile: action.tile });
  },
  CHANGE_TERRAIN: (state, action) => {
    return Object.assign({}, state, { selectedTerrainType: action.terrainType })
  },
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
