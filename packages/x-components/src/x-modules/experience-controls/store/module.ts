import { fetchAndSaveExperienceControlsResponse } from './actions/fetch-and-save-controls.action';
import { fetchExperienceControlsResponse } from './actions/fetch-controls.action';
import { ExperienceControlsXStoreModule } from './types';

/**.
 * {@link XStoreModule} For the experience-controls module.
 *
 * @internal
 */
export const experienceControlsXStoreModule: ExperienceControlsXStoreModule = {
  state: () => ({
    controls: {},
    events: {},
    status: 'initial',
    params: {}
  }),
  getters: {},
  mutations: {
    setControls(state, controls) {
      Object.assign(state.controls, controls);
    },
    setEvents(state, events) {
      Object.assign(state.events, events);
    },
    setParams(state, params) {
      state.params = params;
    }
  },
  actions: {
    fetchExperienceControlsResponse,
    fetchAndSaveExperienceControlsResponse
  }
};
