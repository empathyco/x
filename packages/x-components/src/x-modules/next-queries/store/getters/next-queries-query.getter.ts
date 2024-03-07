import { createRelatedTagsQueryGetter } from '../../../../store/utils/query.utils';
import { NextQueriesXStoreModule } from '../types';

/**
 * Default implementation for the next-queries query getter.
 *
 * @param state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of the related
 * tags' module.
 *
 * @returns The query with the selected related tags concatenated.
 *
 * @public
 */
export const query: NextQueriesXStoreModule['getters']['query'] = createRelatedTagsQueryGetter({
  getRelatedTags: state => state.relatedTags
});
