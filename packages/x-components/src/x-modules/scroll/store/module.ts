import { ScrollXStoreModule } from './types';

/**
 * {@link XStoreModule} For the scroll module.
 *
 * @internal
 */
export const scrollXStoreModule: ScrollXStoreModule = {
  state: () => ({
    data: {},
    pendingScrollTo: ''
  }),
  getters: {},
  mutations: {
    setScrollComponentState(state, { id, newState }) {
      if (!state.data[id]) {
        state.data[id] = {
          hasReachedStart: false,
          hasAlmostReachedEnd: false,
          hasReachedEnd: false,
          position: 0,
          direction: 'UP'
        };
      }
      Object.assign(state.data[id], newState);
    },
    setPendingScrollTo(state, pendingScrollTo) {
      state.pendingScrollTo = pendingScrollTo;
    }
  },
  actions: {}
};
