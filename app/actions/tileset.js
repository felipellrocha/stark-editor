import electron from 'electron';

export const CHANGE_ZOOM = 'CHANGE_ZOOM';

export function viewTilesetEditor(history) {
  return dispatch => {
    history.push('/import');
  }
}

export const CHANGE_TERRAIN = 'CHANGE_TERRAIN';

export function changeTerrain(terrainType) {
  return {
    type: CHANGE_TERRAIN,
    terrainType,
  }
}

export const ADD_TERRAIN = 'ADD_TERRAIN';

export function addTerrain(setIndex, tileIndex, terrainType) {
  return {
    type: ADD_TERRAIN,
    setIndex,
    tileIndex,
    terrainType,
  }
}

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

export const CHANGE_TILESET_TYPE = 'CHANGE_TILESET_TYPE'

export function changeTilesetType(index, tilesetType) {
  return {
    type: CHANGE_TILESET_TYPE,
    index,
    tilesetType,
  }
}

export const CHANGE_TILESET_NAME = 'CHANGE_TILESET_NAME'

export function changeTilesetName(index, name) {
  return {
    type: CHANGE_TILESET_NAME,
    index,
    name,
  }
}

export const CHANGE_TILING_METHOD = 'CHANGE_TILING_METHOD'

export function changeTilingMethod(method) {
  return {
    type: CHANGE_TILING_METHOD,
    method,
  }
}
