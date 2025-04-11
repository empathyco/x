import type { RecommendationsXStoreModule } from '../types'
import { XPlugin } from '../../../../plugins'

/**
 * Default implementation for the {@link RecommendationsActions.fetchRecommendations}.
 *
 * @param _context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @param request - The recommendations request to make.
 * @returns A `void` promise that resolves when it fetches recommendations.
 *
 * @public
 */
export const fetchRecommendations: RecommendationsXStoreModule['actions']['fetchRecommendations'] =
  async (_context, request) => {
    return request ? XPlugin.adapter.recommendations(request).then(({ results }) => results) : []
  }
