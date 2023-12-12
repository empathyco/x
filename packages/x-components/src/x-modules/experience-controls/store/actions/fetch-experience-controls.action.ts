import { ExperienceControlsResponse } from '@empathyco/x-types';
import { ExperienceControlsXStoreModule } from '../types';
import { useXPlugin } from '../../../../plugins/index';

/**
 * Default implementation for the {@link ExperienceControlsActions.fetchExperienceControlsResponse}.
 *
 * @param _context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @param request - The experience controls request to make.
 * @returns The experience controls response.
 *
 * @public
 */
// eslint-disable-next-line max-len
export const fetchExperienceControlsResponse: ExperienceControlsXStoreModule['actions']['fetchExperienceControlsResponse'] =
  (_context, request) => {
    return request
      ? useXPlugin()
          .adapter.experienceControls(request)
          .then(response => response)
      : ({} as ExperienceControlsResponse);
  };
