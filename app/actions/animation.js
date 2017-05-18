import electron from 'electron';
import { nativeImage } from 'electron';

export function selectSpriteSheets() {
  return (dispatch, getState) => {
    const sheets = electron.remote.dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
      filters: [
        {name: 'Image Files', extensions: ['png', 'jpg']},
      ],
    })

    if (!sheets) return;

    dispatch(receiveSpriteSheets(sheets));
  }
}

export const RECEIVE_SPRITE_SHEETS = 'RECEIVE_SPRITE_SHEETS';

export function receiveSpriteSheets(sheets) {
  return {
    type: RECEIVE_SPRITE_SHEETS,
    sheets,
  }
}

export const ADD_ANIMATION = 'ADD_ANIMATION';

export function addAnimation(name) {
  return {
    type: ADD_ANIMATION,
    name,
  }
}

export const CHANGE_ANIMATION_FRAME_LENGTH = 'CHANGE_ANIMATION_FRAME_LENGTH';

export function changeAnimationFrameLength(name, numberOfFrames) {
  return {
    type: CHANGE_ANIMATION_FRAME_LENGTH,
    name,
    numberOfFrames,
  }
}

export const CHANGE_ANIMATION_NAME = 'CHANGE_ANIMATION_NAME';

export function changeAnimationName(name, newName) {
  return {
    type: CHANGE_ANIMATION_NAME,
    name,
    newName,
  }
}

export const SELECT_ANIMATION = 'SELECT_ANIMATION';

export function selectAnimation(name) {
  return {
    type: SELECT_ANIMATION,
    name,
  }
}

export const SELECT_FRAME = 'SELECT_FRAME';

export function selectFrame(index) {
  return {
    type: SELECT_FRAME,
    index,
  }
}

export const DELETE_KEYFRAME = 'DELETE_KEYFRAME';

export function deleteKeyframe(selectedAnimation, selectedFrame) {
  return {
    type: DELETE_KEYFRAME,
    selectedAnimation,
    selectedFrame,
  }
}

export const CREATE_KEYFRAME = 'CREATE_KEYFRAME';

export function createKeyframe(selectedAnimation, selectedFrame, clone) {
  return {
    type: CREATE_KEYFRAME,
    selectedAnimation,
    selectedFrame,
    clone,
  }
}

export const MOVE_SPRITE = 'MOVE_SPRITE';

export function moveSprite(selectedAnimation, selectedFrame, coord) {
  return {
    type: MOVE_SPRITE,
    selectedAnimation,
    selectedFrame,
    coord,
  }
}
