import electron from 'electron';

export const SELECT_TILE = 'SELECT_TILE';

export function selectTile(tile) {
  return {
    type: SELECT_TILE,
    tile: [tile.setIndex, tile.tileIndex],
  }
}

export const PUT_DOWN_TILE = 'PUT_DOWN_TILE';

export function putDownTile(tile) {
  console.log(tile);
  return {
    type: PUT_DOWN_TILE,
    tile,
  }
}
