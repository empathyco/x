import { SemanticQueriesXStoreModule } from '../types';
import { normalizeString } from '../../../../utils/normalize';

/**
 * Default implementacion for the {@link SemanticQueriesGetters.normalizedQuery} getter.
 *
 * @param state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of the semantic
 * queries' module.
 *
 * @returns The normalized query.
 *
 * @public
 */
export const normalizedQuery: SemanticQueriesXStoreModule['getters']['normalizedQuery'] = ({
  query
}) => normalizeString(query);
