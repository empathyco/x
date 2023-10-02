/* eslint-disable max-len */
import { fetchAndSaveExperienceControlsResponse } from './actions/fetch-and-save-experience-controls.action';
import { fetchExperienceControlsResponse } from './actions/fetch-experience-controls.action';
import { experienceControlsResultsRequest } from './getters/experience-controls-results-request.getter';
import { ExperienceControlsXStoreModule } from './types';
/* eslint-enable max-len */

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
  getters: {
    experienceControlsResultsRequest
  },
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
