import electron from 'electron';

export const CHANGE_ZOOM = 'CHANGE_ZOOM';

export function changeZoom(zoom) {
  return {
    type: CHANGE_ZOOM,
    zoom,
  }
}

export const SELECT_LAYER = 'SELECT_LAYER';

export function selectLayer(layer) {
  return {
    type: SELECT_LAYER,
    layer,
  }
}

export const SELECT_TILE = 'SELECT_TILE';

export function selectTile(tile) {
  return {
    type: SELECT_TILE,
    tile: [tile.setIndex, tile.tileIndex],
  }
}

export const PAINT_TILE = 'PAINT_TILE';

export function paintTile(tile) {
  return {
    type: PAINT_TILE,
    tile,
  }
}

export const PUT_DOWN_TILE = 'PUT_DOWN_TILE';

export function putDownTile(tile) {
  return {
    type: PUT_DOWN_TILE,
    tile,
  }
}

export const CHANGE_TILING_METHOD = 'CHANGE_TILING_METHOD'

export function changeTilingMethod(method) {
  return {
    type: CHANGE_TILING_METHOD,
    method,
  }
}
