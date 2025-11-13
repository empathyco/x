import type { FacetsXStoreModule } from '../types'
import { XPlugin } from '../../../../plugins/x-plugin'

/**
 * Default implementation for the {@link FacetsActions.fetchFacetsResponse}.
 *
 * @param _context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @param request - The facets request to make.
 * @returns A Promise of facets response that resolves when it fetches facets response.
 *
 * @public
 */
export const fetchFacetsResponse: FacetsXStoreModule['actions']['fetchFacetsResponse'] = async (
  _context,
  request,
) => XPlugin.adapter.facets(request)
