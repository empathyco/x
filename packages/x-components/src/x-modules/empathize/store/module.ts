import { setConfig } from '../../../store/utils/config-store.utils';
import { EmpathizeXStoreModule } from './types';

/**
 * {@link XStoreModule} For the empathize module.
 *
 * @internal
 */
export const empathizeXStoreModule: EmpathizeXStoreModule = {
  state: () => ({
    config: {},
    isOpen: false
  }),
  getters: {},
  mutations: {
    setIsOpen(state, isOpen) {
      state.isOpen = isOpen;
    },
    setConfig
  },
  actions: {}
};
