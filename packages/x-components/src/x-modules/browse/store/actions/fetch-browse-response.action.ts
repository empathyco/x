import type { BrowseXStoreModule } from '../types'
import { XPlugin } from '../../../../plugins/x-plugin'

/**
 * Default implementation for the {@link BrowseActions.fetchBrowseResponse}.
 *
 * @param _context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @param request - The browse request to make.
 * @returns A Promise of browse response that resolves when it fetches browse response.
 *
 * @public
 */
export const fetchBrowseResponse: BrowseXStoreModule['actions']['fetchBrowseResponse'] = async (
  _context,
  request,
) => XPlugin.adapter.browse(request)
