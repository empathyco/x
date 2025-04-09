import type { SearchXStoreModule } from '../types'
import { getNewAndUpdatedKeys } from '@empathyco/x-utils'
import { isArrayEmpty } from '../../../../utils/array'

/**
 * Default implementation for the {@link SearchActions.resetRequestOnRefinement}.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @param context.commit - commit context.
 * @param context.state - state context.
 * @param watchedRequest - The {@link WatchedInternalSearchRequest} object.
 * @param watchedRequest.newRequest - New request parameters.
 * @param watchedRequest.oldRequest  - Old request parameters.
 * @public
 */
export const resetRequestOnRefinement: SearchXStoreModule['actions']['resetRequestOnRefinement'] = (
  { commit, state },
  { newRequest, oldRequest },
) => {
  if (state.fromNoResultsWithFilters && state.results.length) {
    commit('setFromNoResultsWithFilters', false)
  }
  // is refining request
  if (!!newRequest && !!oldRequest) {
    const changedKeys = getNewAndUpdatedKeys(newRequest, oldRequest).filter(
      value => value !== 'extraParams',
    )
    const changedExtraParams = getNewAndUpdatedKeys(newRequest.extraParams, oldRequest.extraParams)

    if (!isArrayEmpty(changedKeys)) {
      if (!changedKeys.includes('page')) {
        commit('setPage', 1)
      }
      if (changedKeys.includes('query')) {
        commit('setSort', '')
      }
    }
    if (!isArrayEmpty(changedExtraParams)) {
      commit('setPage', 1)
      commit('setSort', '')
    }
  }
}
