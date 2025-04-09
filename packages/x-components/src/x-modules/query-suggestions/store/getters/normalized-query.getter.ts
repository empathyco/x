import type { QuerySuggestionsXStoreModule } from '../types'
import { normalizeString } from '../../../../utils/normalize'

/**
 * Default implementation for the {@link QuerySuggestionsGetters.normalizedQuery} getter.
 *
 * @param state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of the query
 * suggestions module.
 * @param state.query - query state.
 * @returns The normalized query.
 *
 * @public
 */
export const normalizedQuery: QuerySuggestionsXStoreModule['getters']['normalizedQuery'] = ({
  query,
}) => normalizeString(query)
