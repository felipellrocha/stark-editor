export function setStateEnhancer() {
  return (createStore) => (reducer, preloadedState, enhancer) => {
    const store = createStore(reducer, preloadedState, enhancer)

    function setState(state) {
      currentState = state;
    }

    return {
      ...store,
      setState,
    }
  }
}
