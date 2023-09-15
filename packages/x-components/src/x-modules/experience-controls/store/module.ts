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
    status: 'initial'
  }),
  getters: {},
  mutations: {
    setControls(state, controls) {
      Object.assign(state.controls, controls);
    },
    setEvents(state, events) {
      Object.assign(state.events, events);
    }
  },
  actions: {}
};
