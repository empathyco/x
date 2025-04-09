import type { EmpathizeXStoreModule } from './types'
import { mergeConfig, setConfig } from '../../../store/utils/config-store.utils'

/**
 * {@link XStoreModule} For the empathize module.
 *
 * @internal
 */
export const empathizeXStoreModule: EmpathizeXStoreModule = {
  state: () => ({
    config: {},
    isOpen: false,
  }),
  getters: {},
  mutations: {
    setIsOpen(state, isOpen) {
      state.isOpen = isOpen
    },
    setConfig,
    mergeConfig,
  },
  actions: {},
}
