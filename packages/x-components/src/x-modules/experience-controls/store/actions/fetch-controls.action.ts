import { ExperienceControlsXStoreModule } from '../types';

/**
 * Default implementation for the {@link ExperienceControlsActions.fetchControls}.
 *
 * @param _context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * TODO: update when adapter is updateds.
 * @param request
 * @returns
 *
 * @public
 */

// eslint-disable-next-line max-len
export const fetchExperienceControlsResponse: ExperienceControlsXStoreModule['actions']['fetchExperienceControlsResponse'] =
  async () => {
    const response = await fetch(
      // eslint-disable-next-line max-len
      'https://config-service.internal.test.empathy.co/public/configs?service=xcontrols&instance=empathy'
    );

    if (response.ok) {
      const controls = await response.json();

      const aux = {
        controls,
        events: {}
      };

      return aux;
    } else {
      throw new Error('Failed to fetch data');
    }

    //return XPlugin.adapter.experienceControls(request).then(({ controls }) => controls);
  };
