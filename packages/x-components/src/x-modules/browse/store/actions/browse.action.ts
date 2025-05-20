import type { BrowseXStoreModule } from '../types'
import { XPlugin } from '../../../../plugins/x-plugin'

/**
 * Default implementation for the {@link BrowseActions.browse}.
 *
 * @param _ - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @param request - The browse request to make.
 * @returns The browse response.
 *
 * @public
 */
export const browse: BrowseXStoreModule['actions']['browse'] = async (_, request) => {
  return request
    ? XPlugin.adapter.browse(request)
    : {
        results: [],
        facets: [],
        totalResults: 0,
      }
}
