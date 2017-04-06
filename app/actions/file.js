import electron from 'electron';

export const RECEIVE_TILESETS = 'RECEIVE_TILESETS';

export function selectTilesets() {
  return dispatch => {
    const tilesets = electron.remote.dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections']
    })
    dispatch(receiveTilesets(tilesets));
  }
}

export function receiveTilesets(tilesets) {
  return {
    type: RECEIVE_TILESETS,
    tilesets,
  }
}
