import type { QuerySuggestionsXStoreModule } from '../types'
import { XPlugin } from '../../../../plugins'

/**
 * Default implementation for the {@link QuerySuggestionsActions.fetchSuggestions}.
 *
 * @param _context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @param request - The query suggestions request to make.
 *
 * @returns A `void` promise that resolves when it fetches suggestions.
 *
 * @public
 */
export const fetchSuggestions: QuerySuggestionsXStoreModule['actions']['fetchSuggestions'] = async (
  _context,
  request,
) => {
  return request
    ? XPlugin.adapter.querySuggestions(request).then(({ suggestions }) => suggestions)
    : []
}
