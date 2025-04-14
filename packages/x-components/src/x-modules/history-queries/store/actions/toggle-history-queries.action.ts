import type { HistoryQueriesXStoreModule } from '../types'
import { localStorageService } from '../../../../utils/storage'
import { HISTORY_QUERIES_ENABLED_KEY } from '../constants'

export const toggleHistoryQueries: HistoryQueriesXStoreModule['actions']['toggleHistoryQueries'] =
  async ({ dispatch, commit }, isEnabled) => {
    if (!isEnabled) {
      await dispatch('setHistoryQueries', [])
    }

    commit('setIsEnabled', isEnabled)
    localStorageService.setItem(HISTORY_QUERIES_ENABLED_KEY, isEnabled)
  }
