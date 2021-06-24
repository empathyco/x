import { DeviceXStoreModule } from './types';

/**
 * {@link XStoreModule} For the device module.
 *
 * @internal
 */
export const deviceXStoreModule: DeviceXStoreModule = {
  state: () => ({
    device: null
  }),
  getters: {},
  mutations: {
    setDevice(state, device) {
      state.device = device;
    }
  },
  actions: {}
};
