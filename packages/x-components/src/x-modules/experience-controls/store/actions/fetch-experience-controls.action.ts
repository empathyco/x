import type { ExperienceControlsResponse } from '@empathyco/x-types'
import type { ExperienceControlsXStoreModule } from '../types'
import { XPlugin } from '../../../../plugins/x-plugin'

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

export const fetchExperienceControlsResponse: ExperienceControlsXStoreModule['actions']['fetchExperienceControlsResponse'] =
  async (_context, request) => {
    return request
      ? XPlugin.adapter.experienceControls(request).then(response => response)
      : ({} as ExperienceControlsResponse)
  }
