import { handleActions } from 'redux-actions';

import {
  EMPTY,
} from 'utils/constants';

import {
	UUID,
  arrayReplace,
  arrayMoveUp,
  arrayMoveDown,
  arrayRemove,
  flood,
} from 'utils';

import {
  ADD_LAYER,
  TOGGLE_LAYER_VISIBILITY,
  MOVE_LAYER_UP,
  MOVE_LAYER_DOWN,
  REMOVE_LAYER,
  CHANGE_LAYER_NAME,

  CHANGE_GRID_COLUMNS,
  CHANGE_GRID_ROWS,

  PUT_DOWN_TILE,
  PAINT_TILE,

  LOAD_STAGE,
  SAVE_FILENAME,
} from 'actions';

import {
  IndexToXY,
  XYToIndex,
} from 'utils';

export const initialState = {
  grid: {
    columns: 10,
    rows: 10,
  },
  layers: [ ],
};

initialState.layers = ['background', 'middleground', 'foreground'].map(name => ({
  id: UUID(),
  type: 'tile',
  name: name,
  visible: true,
  data: [...Array(initialState.grid.rows * initialState.grid.columns)].map((_, i) => [EMPTY, 0]),
}));

export default handleActions({
  CHANGE_GRID_COLUMNS: (state, action) => {
    const newGrid = Object.assign({}, state.grid, { columns: action.value });

    const layers = (function() {
      if (action.value === state.grid.columns) return state.layers;
      else if (action.value > state.grid.columns) {
        const newColumns = [...Array(action.value - state.grid.columns)].map((_, i) => [EMPTY, 0]);
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
          const newRows = [...Array((action.value - state.grid.rows) * state.grid.columns)].map((_, i) => [EMPTY, 0])
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
  ADD_LAYER: (state, action) => {
    const layer = {
			id: UUID(),
      type: 'tile',
      name: 'untitled',
      visible: true,
      data: [...Array(state.grid.rows * state.grid.columns)].map((_, i) => [EMPTY, 0]),
    };

    const layers = [...state.layers, layer];

    return Object.assign({}, state, { layers: layers });
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
      selectedTile,
    } = action;

    const {
      layers,
      grid,
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

  PUT_DOWN_TILE: (state, action) => {
    const {
      tile: {
        x: x_click,
        y: y_click,
      },
      layer,
      tileset,
      selectedTile,
      selectedShape,
    } = action;

    const {
      layers,
      grid,
    } = state;

    const index = XYToIndex(x_click, y_click, grid);

    // calculate future values. Only proceed if at least
    // one of the values is different
    /*
    if (
      currentTile[0] === selectedTile[0] &&
      currentTile[1] === selectedTile[1] &&
      selectedShape.columns === 1 &&
      selectedShape.rows === 1
    ) { return state };
    */

    // create a new entire state first for performance reasons
    const newState = {
      ...state,
      layers: [
        ...state.layers.slice(0, layer),
        {
          ...state.layers[layer],
          data: [
            ...state.layers[layer].data,
          ],
        },
        ...state.layers.slice(layer + 1, state.layers.length),
      ],
    };

    const count = selectedShape.columns * selectedShape.rows;
    const currentLayer = layers[layer];
    const [x_s, y_s] = IndexToXY(selectedTile[1], tileset);

    [...Array(count)].forEach((_, i) => {
      const [x_i, y_i] = IndexToXY(i, selectedShape);

      const x_g = x_click + x_i;
      const y_g = y_click + y_i;

      const x_t = x_s + x_i;
      const y_t = y_s + y_i;

      const gridIndex = XYToIndex(x_g, y_g, grid);
      const tilesetIndex = XYToIndex(x_t, y_t, tileset);

      newState.layers[layer].data[gridIndex] = [
        selectedTile[0],
        tilesetIndex,
      ];
    });

    return newState;
  },
  LOAD_STAGE: (state, action) => {
    if (!action.tilemap) return initialState;

    // clean up integers
    action.tilemap.layers = action.tilemap.layers.map(layer => {
      const data = layer.data.map(t => {
        const [set, tile] = t;

        const setIndex = parseInt(set);
        const tileIndex = parseInt(tile);
        
        if (set !== -2) return [setIndex, tileIndex];
        else return [setIndex, tile];
      });

      return Object.assign({}, layer, {
        data,
      });
    });
    // clean up integers

    return { ...action.tilemap };
  },
  SAVE_FILENAME: (state, action) => {
    // clean up integers
    const layers = state.layers.map(layer => {
      const data = layer.data.map(t => {
        const [set, tile] = t;

        const setIndex = parseInt(set);
        const tileIndex = parseInt(tile);
        
        if (set !== -2) return [setIndex, tileIndex];
        else return [setIndex, tile];
      });

      return Object.assign({}, layer, {
        data,
      });
    });

    return Object.assign({}, state, { layers });
    // clean up integers
  }
}, initialState); 
