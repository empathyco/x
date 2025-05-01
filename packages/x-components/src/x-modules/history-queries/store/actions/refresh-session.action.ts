import type { HistoryQueriesXStoreModule } from '../types'
import { localStorageService } from '../../../../utils/storage'
import { SESSION_TIME_STAMP_STORAGE_KEY } from '../constants'

/**
 * Default implementation for the {@link HistoryQueriesActions.refreshSession}.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @public
 */
export const refreshSession: HistoryQueriesXStoreModule['actions']['refreshSession'] = ({
  state,
  commit,
}) => {
  const sessionTimeStampInMs =
    localStorageService.getItem<number>(SESSION_TIME_STAMP_STORAGE_KEY) ?? Date.now()
  localStorageService.setItem(
    SESSION_TIME_STAMP_STORAGE_KEY,
    sessionTimeStampInMs,
    state.config.sessionTTLInMs,
  )
  commit('setSessionTimeStamp', sessionTimeStampInMs)
}
