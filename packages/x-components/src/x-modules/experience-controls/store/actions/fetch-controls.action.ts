import { ExperienceControlsXStoreModule } from '../types';
import { XPlugin } from '../../../../plugins/x-plugin';

/**
 * Default implementation for the {@link ExperienceControlsActions.fetchControls}.
 *
 * @param _context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 *
 * @param request - Parameters are empty for this action.
 * @returns 'controls' data with the controls data configuration.
 *
 * @public
 */
// eslint-disable-next-line max-len
export const fetchExperienceControlsResponse: ExperienceControlsXStoreModule['actions']['fetchExperienceControlsResponse'] =
  async (_context, request) => {
    const { controls } = await XPlugin.adapter.experienceControls(request);
    return controls;
  };
