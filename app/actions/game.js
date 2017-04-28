export const CHANGE_GAME_NAME = 'CHANGE_GAME_NAME';

export function changeGameName(name) {
  return {
    type: CHANGE_GAME_NAME,
    name,
  }
}

export const CHANGE_TILE_WIDTH = 'CHANGE_TILE_WIDTH';

export function changeTileWidth(value) {
  return {
    type: CHANGE_TILE_WIDTH,
    value,
  }
}

export const CHANGE_TILE_HEIGHT = 'CHANGE_TILE_HEIGHT';

export function changeTileHeight(value) {
  return {
    type: CHANGE_TILE_HEIGHT,
    value,
  }
}
