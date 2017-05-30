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
        terrains: {},
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
        selectedMap,
      },
      app,
      tilemap,
    } = getState();

    const savePath = (() => {
      if (globalFilename === '' || saveAs) {
        return electron.remote.dialog.showSaveDialog({
          properties: ['openDirectories'],
          filters: [
            {name: 'Game Files', extensions: ['targ']},
          ],
        })
      } else {
        return globalFilename;
      }
    })();
    const newBasepath = path.dirname(savePath);
    
    // write filename to memory
    dispatch(saveFilename(savePath, oldBasepath, newBasepath));

    const appFile = `${savePath}/app.json`;
    const mapsPath = `${savePath}/maps`;
    const mapFile = `${savePath}/maps/${selectedMap}.json`;

    if (!fs.existsSync(savePath)) fs.mkdirSync(savePath);
    if (!fs.existsSync(mapsPath)) fs.mkdirSync(mapsPath);
    fs.writeFileSync(appFile, JSON.stringify(getState().app));
    fs.writeFileSync(mapFile, JSON.stringify(getState().tilemap));
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
  return (dispatch, getState) => {
    const {
      global: {
        selectedMap,
      },
    } = getState();

    const appPath = electron.remote.dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [
        {name: 'Game Files', extensions: ['targ']},
      ],
    })[0];

    const appFile = `${appPath}/app.json`;
    const mapsPath = `${appPath}/maps`;
    const mapFile = `${appPath}/maps/${selectedMap}.json`;


    const app = fs.readFileSync(appFile);
    const tilemap = fs.readFileSync(mapFile);
    const basepath = path.dirname(appPath);

    dispatch(updatePaths(appPath, basepath));
    dispatch(loadStage(JSON.parse(app), JSON.parse(tilemap)));
  }
}

export const LOAD_STAGE = 'LOAD_STAGE';

export function loadStage(app, tilemap) {
  return {
    type: LOAD_STAGE,
    app,
    tilemap,
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
