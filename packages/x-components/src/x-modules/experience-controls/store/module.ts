import { ExperienceControlsXStoreModule } from './types';

/**
 * {@link XStoreModule} For the empathize module.
 *
 * @internal
 */
export const experienceControlsXStoreModule: ExperienceControlsXStoreModule = {
  state: () => ({
    controls: {},
    events: {}
  }),
  getters: {},
  mutations: {
    setControls(state: any, experienceControlsConfig: any) {
      Object.assign(state.config, experienceControlsConfig);
    }
  },
  actions: {}
};
