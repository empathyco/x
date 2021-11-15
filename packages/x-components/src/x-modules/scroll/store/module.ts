import { ScrollXStoreModule } from './types';
import { initScrollComponentState } from './utils';

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
    setScrollPosition(state, { id, position }) {
      initScrollComponentState(state.data, id);
      state.data[id].position = position;
    },
    setScrollDirection(state, { id, direction }) {
      initScrollComponentState(state.data, id);
      state.data[id].direction = direction;
    },
    setScrollHasReachedEnd(state, { id, value }) {
      initScrollComponentState(state.data, id);
      state.data[id].hasReachedEnd = value;
    },
    setScrollHasReachedStart(state, { id, value }) {
      initScrollComponentState(state.data, id);
      state.data[id].hasReachedStart = value;
    },
    setPendingScrollTo(state, pendingScrollTo) {
      state.pendingScrollTo = pendingScrollTo;
    }
  },
  actions: {}
};
