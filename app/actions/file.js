import electron from 'electron';
import { nativeImage } from 'electron';
import fs from 'fs';

export const RECEIVE_TILESETS = 'RECEIVE_TILESETS';

export function selectTilesets() {
  return (dispatch, getState) => {
    const {
      tile,
    } = getState();

    const tilesets = electron.remote.dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections']
    })

    dispatch(receiveTilesets(tilesets.map(tileset => {
      const image = nativeImage.createFromPath(tileset);
      const size = image.getSize();

      const rows = size.height / tile.height;
      const columns = size.width / tile.width;

      return {
        src: tileset,
        rows,
        columns,
      };
    })));
  }
}

export function receiveTilesets(tilesets) {
  return {
    type: RECEIVE_TILESETS,
    tilesets,
  }
}

export function writeFile() {
  return (dispatch, getState) => {
    const state = getState();

    fs.writeFileSync(state.filename, JSON.stringify(state));
  }
}

export function openFile() {
  return (dispatch, getState, setState) => {
    const state = getState();

    const gameFile = electron.remote.dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [
        {name: 'Game Files', extensions: ['targ']},
      ],
    })

    const game = fs.readFileSync(gameFile[0]);

    dispatch(loadStage(JSON.parse(game)));
  }
}

export const LOAD_STAGE = 'LOAD_STAGE';

export function loadStage(data) {
  return {
    type: LOAD_STAGE,
    data,
  }
}
