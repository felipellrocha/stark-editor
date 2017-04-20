import electron from 'electron';
import { nativeImage } from 'electron';
import fs from 'fs';
import path from 'path';

export const RECEIVE_TILESETS = 'RECEIVE_TILESETS';

export function selectTilesets(history) {
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

    if (!tilesets) return;

    dispatch(receiveTilesets(tilesets.map(tileset => {
      const image = nativeImage.createFromPath(tileset);
      const size = image.getSize();

      const rows = size.height / tile.height;
      const columns = size.width / tile.width;

      const src = path.relative(basepath, tileset);
      const name = path.basename(tileset);
      const type = 'tile';

      return {
        src,
        name,
        rows,
        columns,
        type,
      };
    })));

    history.push('/import');
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
        return globalFilename;
      }
    })();
    const newBasepath = path.dirname(filename);
    
    dispatch(saveFilename(filename, oldBasepath, newBasepath));

    fs.writeFileSync(filename, JSON.stringify(getState().app));
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
    const filename = electron.remote.dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [
        {name: 'Game Files', extensions: ['targ']},
      ],
    })[0];

    const game = fs.readFileSync(filename);
    const basepath = path.dirname(filename);

    dispatch(updatePaths(filename, basepath));
    dispatch(loadStage(JSON.parse(game)));
  }
}

export const LOAD_STAGE = 'LOAD_STAGE';

export function loadStage(data, filename, basepath) {
  return {
    type: LOAD_STAGE,
    data,
  }
}

export const UPDATE_PATHS = 'UPDATE_PATHS';

export function updatePaths(filename, basepath) {
  return {
    type: UPDATE_PATHS,
    filename,
    basepath,
  }
}
