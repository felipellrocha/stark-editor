function createThunkMiddleware(extraArgument) {
  //return ({ dispatch, getState, setState }) => next => action => {
  return store => next => action => {
    if (typeof action === 'function') {
      return action(store.dispatch, store.getState, store.setState, extraArgument);
    }

    return next(action);
  };
}

const thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;

export { thunk };
