import type { HistoryQuery } from '@empathyco/x-types'
import type { HistoryQueriesXStoreModule } from '../types'
import { localStorageService } from '../../../../utils/storage'

/**
 * Default implementation for the
 * {@link HistoryQueriesActions.loadHistoryQueriesFromBrowserStorage} action.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @public
 */

export const loadHistoryQueriesFromBrowserStorage: HistoryQueriesXStoreModule['actions']['loadHistoryQueriesFromBrowserStorage'] =
  ({ commit, getters }) => {
    const historyQueries = localStorageService.getItem<HistoryQuery[]>(getters.storageKey) ?? []
    commit('setHistoryQueries', historyQueries)
  }
