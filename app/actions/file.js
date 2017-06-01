import electron, { ipcRenderer as ipc } from 'electron';
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
  }
}

export function receiveTilesets(tilesets) {
  return {
    type: RECEIVE_TILESETS,
    tilesets,
  }
}

export function newGame() {
  return (dispatch, getState) => {
    const savePath =  electron.remote.dialog.showSaveDialog({
      properties: ['openDirectories'],
      filters: [
        {name: 'Game Files', extensions: ['targ']},
      ],
    });
    const newBasepath = path.dirname(savePath);
    
    // write filename to memory
    dispatch(saveFilename(savePath));

    const {
      app,
      tilemap,
    } = getState();

    const appFile = `${savePath}/app.json`;
    const mapsPath = `${savePath}/maps`;

    if (!fs.existsSync(savePath)) fs.mkdirSync(savePath);
    if (!fs.existsSync(mapsPath)) fs.mkdirSync(mapsPath);

    fs.writeFileSync(appFile, JSON.stringify(app));
    app.maps.forEach(m => {
      const mapFile = `${savePath}/maps/${m.id}.json`;
      fs.writeFileSync(mapFile, JSON.stringify(tilemap));
    });

    /*
    electron.remote.getCurrentWindow().show();
    electron.remote.getCurrentWindow().focus();
    */
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
      if (saveAs) {
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

    if (savePath === '' || !savePath) return;

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
    const app = JSON.parse(fs.readFileSync(appFile));

    const map = app.maps[selectedMap];

    const mapsPath = `${appPath}/maps`;
    const mapFile = `${appPath}/maps/${map.id}.json`;


    const tilemap = JSON.parse(fs.readFileSync(mapFile));
    const basepath = path.dirname(appPath);

    dispatch(updatePaths(appPath, basepath));
    dispatch(loadStage(app, tilemap));

    /*
    electron.remote.getCurrentWindow().show();
    electron.remote.getCurrentWindow().focus();
    */
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

export function changeMap(index) {
  return (dispatch, getState) => {
    const {
      global: {
        filename,
      },
      app,
    } = getState();

    const map = app.maps[index];

    const appFile = `${filename}/app.json`;
    const mapsPath = `${filename}/maps`;
    const mapFile = `${filename}/maps/${map.id}.json`;

    const tilemap = (function() {
      if (fs.existsSync(mapFile)) return JSON.parse(fs.readFileSync(mapFile));
      else return null;
    })();

    dispatch(selectMap(index));
    dispatch(loadStage(null, tilemap));
  }
}

export const SELECT_MAP = 'SELECT_MAP';
export function selectMap(index) {
  return {
    type: SELECT_MAP,
    index,
  }
}
