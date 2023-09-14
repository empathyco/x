import { ExperienceControlsXStoreModule } from '../types';

/**
 * Default implementation for the {@link ExperienceControlsActions.fetchControls}.
 *
 * @param _context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @param request - To be done.
 * @returns To be done.
 *
 * @public
 */

export const fetchControls: ExperienceControlsXStoreModule['actions']['fetchControls'] = () => {
  return fetch(
    // eslint-disable-next-line max-len
    'https://config-service.internal.test.empathy.co/public/configs?service=xcontrols&instance=empathy'
  ).then(response => response.json());

  //return XPlugin.adapter.experienceControls(request).then(({ controls }) => controls);
};
