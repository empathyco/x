import { DeviceXStoreModule } from './types';

/**
 * {@link XStoreModule} For the device module.
 *
 * @internal
 */
export const deviceXStoreModule: DeviceXStoreModule = {
  state: () => ({
    name: null
  }),
  getters: {},
  mutations: {
    setName(state, name) {
      state.name = name;
    }
  },
  actions: {}
};
