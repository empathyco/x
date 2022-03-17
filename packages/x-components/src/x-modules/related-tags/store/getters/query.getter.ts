import { createRelatedTagsQueryGetter } from '../../../../store/utils/query.utils';
import { RelatedTagsXStoreModule } from '../types';
/**
 * Default implementation for the {@link RelatedTagsGetters.query} getter.
 *
 * @param state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of the related
 * tags' module.
 *
 * @returns The query with the selected related tags concatenated.
 *
 * @public
 */
export const query: RelatedTagsXStoreModule['getters']['query'] = createRelatedTagsQueryGetter({
  getRelatedTags: state => state.selectedRelatedTags
});
