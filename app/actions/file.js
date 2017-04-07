import electron from 'electron';
import { nativeImage } from 'electron';

export const RECEIVE_TILESETS = 'RECEIVE_TILESETS';

export function selectTilesets() {
  return (dispatch, getState) => {
    const {
      app: {
        tile,
      }
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
