import { normalizeString } from '../../../../utils/normalize';
import { HistoryQueriesXStoreModule } from '../types';

/**
 * Default implementation for the {@link HistoryQueriesGetters.normalizedQuery} getter.
 *
 * @param state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of the history
 * queries module.
 * @returns The normalized query.
 */
export const normalizedQuery: HistoryQueriesXStoreModule['getters']['normalizedQuery'] = ({
  query
}) => normalizeString(query);
