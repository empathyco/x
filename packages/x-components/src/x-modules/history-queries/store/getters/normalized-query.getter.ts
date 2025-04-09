import type { HistoryQueriesXStoreModule } from '../types'
import { normalizeString } from '../../../../utils/normalize'

/**
 * Default implementation for the {@link HistoryQueriesGetters.normalizedQuery} getter.
 *
 * @param state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of the history
 * queries module.
 * @param state.query - query state.
 *
 * @returns The normalized query.
 *
 * @public
 */
export const normalizedQuery: HistoryQueriesXStoreModule['getters']['normalizedQuery'] = ({
  query,
}) => normalizeString(query)
