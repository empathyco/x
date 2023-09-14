import { fetchAndSaveControls } from './actions/fetch-and-save-controls.action';
import { fetchControls } from './actions/fetch-controls.action';
import { ExperienceControlsXStoreModule } from './types';

/**
 * {@link XStoreModule} For the empathize module.
 *
 * @internal
 */
export const experienceControlsXStoreModule: ExperienceControlsXStoreModule = {
  state: () => ({
    controls: {},
    events: {},
    status: 'initial'
  }),
  getters: {},
  mutations: {
    setControls(state: any, experienceControlsConfig: any) {
      Object.assign(state.config, experienceControlsConfig);
    }
  },
  actions: {
    fetchControls,
    fetchAndSaveControls
  }
};
