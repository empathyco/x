import type { ScrollComponentState, ScrollXStoreModule } from './types'

const defaultState: ScrollComponentState = {
  hasReachedStart: false,
  hasAlmostReachedEnd: false,
  hasReachedEnd: false,
  position: 0,
  direction: 'UP',
}

/**
 * {@link XStoreModule} For the scroll module.
 *
 * @internal
 */
export const scrollXStoreModule: ScrollXStoreModule = {
  state: () => ({
    data: {},
    pendingScrollTo: '',
  }),
  getters: {},
  mutations: {
    setScrollComponentState(state, { id, newState }) {
      state.data[id] = { ...(state.data[id] ?? defaultState), ...newState }
    },
    setPendingScrollTo(state, pendingScrollTo) {
      state.pendingScrollTo = pendingScrollTo
    },
  },
  actions: {},
}
