import electron from 'electron';
import { nativeImage } from 'electron';
import fs from 'fs';
import path from 'path';

export const RECEIVE_TILESETS = 'RECEIVE_TILESETS';

export function selectTilesets() {
  return (dispatch, getState) => {
    const {
      app: {
        tile,
      },
      global: {
        basepath,
      },
    } = getState();

    const tilesets = electron.remote.dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
      filters: [
        {name: 'Image Files', extensions: ['png', 'jpg']},
      ],
    })

    if (tilesets)
    dispatch(receiveTilesets(tilesets.map(tileset => {
      const image = nativeImage.createFromPath(tileset);
      const size = image.getSize();

      const rows = size.height / tile.height;
      const columns = size.width / tile.width;

      const src = path.relative(basepath, tileset);
      const name = path.basename(tileset);

      return {
        src,
        name,
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

export function writeFile(saveAs = false) {
  return (dispatch, getState) => {
    const {
      global: {
        filename: globalFilename,
        basepath: oldBasepath,
      },
      app,
    } = getState();

    const filename = (() => {
      if (globalFilename === '' || saveAs) {
        return electron.remote.dialog.showSaveDialog({
          properties: ['openFile'],
          filters: [
            {name: 'Game Files', extensions: ['targ']},
          ],
        })
      } else {
        return state.global.filename;
      }
    })();
    const newBasepath = path.dirname(filename);
    
    dispatch(saveFilename(filename, oldBasepath, newBasepath));

    fs.writeFileSync(filename, JSON.stringify(app));
  }
}

export const SAVE_FILENAME = 'SAVE_FILENAME';

export function saveFilename(filename, oldBasepath, newBasepath) {
  return {
    type: SAVE_FILENAME,
    filename,
    oldBasepath,
    newBasepath,
  }
}

export function openFile() {
  return dispatch => {

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
