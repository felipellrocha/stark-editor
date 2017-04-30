import { handleActions } from 'redux-actions';

import path from 'path';

import {
  ADD_LAYER,
  CHANGE_GAME_NAME,
  CHANGE_GRID_COLUMNS,
  CHANGE_GRID_ROWS,
  ADD_TERRAIN,
  RECEIVE_TILESETS,
  CHANGE_TILESET_NAME,
  CHANGE_TILE_WIDTH,
  CHANGE_TILE_HEIGHT,
  PAINT_TILE,
  LOAD_STAGE,
  SAVE_FILENAME,
  TOGGLE_LAYER_VISIBILITY,
  MOVE_LAYER_UP,
  MOVE_LAYER_DOWN,
  REMOVE_LAYER,
  CHANGE_LAYER_NAME,
} from 'actions';

import {
  arrayMoveUp,
  arrayMoveDown,
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
    return Object.assign({}, state, { tile: newTile });
  },
  CHANGE_TILE_HEIGHT: (state, action) => {
    const newTile = Object.assign({}, state.tile, { height: action.value });
    return Object.assign({}, state, { tile: newTile });
  },
  CHANGE_GRID_COLUMNS: (state, action) => {
    const newGrid = Object.assign({}, state.grid, { columns: action.value });

    const layers = (function() {
      if (action.value === state.grid.columns) return state.layers;
      else if (action.value > state.grid.columns) {
        const newColumns = [...Array(action.value - state.grid.columns)].map((_, i) => [-1, 0]);
        const rows = [...Array(state.grid.rows)];

        return state.layers.map(layer => {
          const newRows = rows.map((_, i) => {
            const start = i * state.grid.columns;
            const end = start + state.grid.columns;
            const row = layer.data.slice(start, end);

            return [...row, ...newColumns];
          }, []);

          return Object.assign({}, layer, { data: newRows.reduce((prev, curr) => prev.concat(curr), []) });
        });
      }
      else {
        return state.layers.map(layer => {
          const rows = [...Array(state.grid.rows)];
          const newRows = rows.map((_, i) => {
            const start = i * state.grid.columns;
            const end = start + action.value;
            return layer.data.slice(start, end);
          }, []);

          return Object.assign({}, layer, { data: newRows.reduce((prev, curr) => prev.concat(curr), []) });
        });
      }
    })();

    return Object.assign({}, state, { grid: newGrid, layers: layers });
  },
  CHANGE_GRID_ROWS: (state, action) => {
    const newGrid = Object.assign({}, state.grid, { rows: action.value });

    const layers = (function() {
      if (action.value === state.grid.rows) return state.layers;
      else if (action.value > state.grid.rows) {
        return state.layers.map(layer => {
          const newRows = [...Array((action.value - state.grid.rows) * state.grid.columns)].map((_, i) => [-1, 0])
          const data = [...layer.data, ...newRows];
          return Object.assign({}, layer, { data });
        });
      }
      else {
        return state.layers.map(layer => {
          const data = [...layer.data.slice(0, action.value * state.grid.columns)]
          return Object.assign({}, layer, { data });
        });
      }
    })();

    return Object.assign({}, state, { grid: newGrid, layers: layers });
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
  ADD_LAYER: (state, action) => {
    const layer = {
      type: 'tile',
      name: 'untitled',
      visible: true,
      data: [...Array(state.grid.rows * state.grid.columns)].map((_, i) => [-1, 0]),
    };

    const layers = [...state.layers, layer];

    return Object.assign({}, state, { layers: layers });
  },
  MOVE_LAYER_UP: (state, action) => {
    const newLayers = arrayMoveUp(state.layers, action.layer);

    return Object.assign({}, state, { layers: newLayers });
  },
  MOVE_LAYER_DOWN: (state, action) => {
    const newLayers = arrayMoveDown(state.layers, action.layer);

    return Object.assign({}, state, { layers: newLayers });
  },
  CHANGE_LAYER_NAME: (state, action) => {
    const layer = state.layers[action.layer];
    const newLayer = Object.assign({}, layer, { name: action.value });
    const newLayers = arrayReplace(state.layers, newLayer, action.layer);

    return Object.assign({}, state, { layers: newLayers });
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
