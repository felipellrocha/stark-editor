import { handleActions } from 'redux-actions';

export default handleActions({
  LOAD_STAGE: (state, action) => {
    return action.data;
  },
});
