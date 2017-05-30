import { handleActions } from 'redux-actions';

import path from 'path';

import {
  arrayReplace,
	UUID,
} from 'utils';

import {
  ADD_ANIMATION,
  CHANGE_ANIMATION_NAME,
  CHANGE_ANIMATION_FRAME_LENGTH,
  MOVE_SPRITE,
  CREATE_KEYFRAME,
  DELETE_KEYFRAME,

  CHANGE_GAME_NAME,
  CHANGE_TILE_WIDTH,
  CHANGE_TILE_HEIGHT,

  ADD_TERRAIN,

  RECEIVE_TILESETS,
  CHANGE_TILESET_NAME,

  SAVE_FILENAME,
  LOAD_STAGE,

  RECEIVE_SPRITE_SHEETS,
} from 'actions';

const initialState = {
  name: 'Untitled',
  tile: {
    width: 48,
    height: 48,
  },
  tilesets: [ ],
  sheets: [ ],
  maps: [ ],
  animations: { },
  entities: { },
};

initialState.maps = ['start', 'inside'].map(name => ({
  id: UUID(),
  name,
}));

export default handleActions({
  ADD_ANIMATION: (state, action) => {
    return {
      ...state,
      animations: {
        ...state.animations,
        [action.name]: {
          id: UUID(),
          numberOfFrames: 32,
          sheet: 0,
          spritesheet: 0,
          keyframes: {
            0: {
              x: 0,
              y: 0,
              w: state.tile.width,
              h: state.tile.height,
            },
          },
        }
      }
    }
  },
  CHANGE_ANIMATION_FRAME_LENGTH: (state, action) => {
    return {
      ...state,
      animations: {
        ...state.animations,
        [action.name]: {
          ...state.animations[action.name],
          numberOfFrames: parseInt(action.numberOfFrames),
        }
      },
    }
  },
  CHANGE_ANIMATION_NAME: (state, action) => {
    const {
      animations: {
        [action.name]: animation,
        ...animations,
      }
    } = state;

    return {
      ...state,
      animations: {
        ...animations,
        [action.newName]: animation,
      },
    }
  },
  DELETE_KEYFRAME: (state, action) => {
    const {
      selectedAnimation,
      selectedFrame,
    } = action;

    if (!state.animations[selectedAnimation].keyframes[selectedFrame]) return state;
    if (selectedFrame === 0) return state;

    const {
      animations: {
        [selectedAnimation]: {
          keyframes
        }
      }
    } = state;

    const newFrames = Object.assign({}, keyframes);
    delete newFrames[selectedFrame];

    return {
      ...state,
      animations: {
        ...state.animations,
        [selectedAnimation]: {
          ...state.animations[selectedAnimation],
          keyframes: newFrames,
        }
      }
    }
  },
  CREATE_KEYFRAME: (state, action) => {
    const {
      selectedAnimation,
      selectedFrame,
      clone,
    } = action;

    return {
      ...state,
      animations: {
        ...state.animations,
        [selectedAnimation]: {
          ...state.animations[selectedAnimation],
          keyframes: {
            ...state.animations[selectedAnimation].keyframes,
            [selectedFrame]: clone,
          }
        }
      }
    }
  },
  MOVE_SPRITE: (state, action) => {
    const {
      selectedAnimation,
      selectedFrame,
      coord,
    } = action;

    const frame = state.animations[selectedAnimation].keyframes[selectedFrame];

    let x = frame.x;
    let y = frame.y;

    if (coord === 'ArrowUp') y += 1;
    if (coord === 'ArrowRight') x += 1;
    if (coord === 'ArrowDown') y -= 1;
    if (coord === 'ArrowLeft') x -= 1;
    
    return {
      ...state,
      animations: {
        ...state.animations,
        [selectedAnimation]: {
          ...state.animations[selectedAnimation],
          keyframes: {
            ...state.animations[selectedAnimation].keyframes,
            [selectedFrame]: {
              ...state.animations[selectedAnimation].keyframes[selectedFrame],
              x,
              y,
            }
          }
        }
      }
    }
  },
  CHANGE_TILE_WIDTH: (state, action) => {
    return {
      ...state,
      tile: {
        ...state.tile,
        width: action.value,
      }
    }
  },
  CHANGE_TILE_HEIGHT: (state, action) => {
    return {
      ...state,
      tile: {
        ...state.tile,
        height: action.value,
      }
    }
  },
  CHANGE_GAME_NAME: (state, action) => {
    return {
      ...state,
      name: action.name,
    }
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
    const {
      oldBasepath,
      newBasepath,
    } = action;

    const tilesets = state.tilesets.map(tileset => {
      const resolve = path.resolve(oldBasepath, tileset.src);
      const src = path.relative(newBasepath, resolve);

      return Object.assign({}, tileset, {
        src,
      });
    });

    debugger;

    return Object.assign({}, state, { tilesets: tilesets });
  },

  RECEIVE_SPRITE_SHEETS: (state, action) => {
    const sheets  = [...state.sheets, ...action.sheets];

    return Object.assign({}, state, { sheets });
  },

  LOAD_STAGE: (state, action) => {
    return Object.assign({}, state, action.app);
  },
}, initialState);
