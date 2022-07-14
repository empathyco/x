import { XPlugin } from '../../../../plugins/x-plugin';
import { RelatedTagsXStoreModule } from '../types';

/**
 * Default implementation for the {@link RelatedTagsActions.fetchRelatedTags}.
 *
 * @param _context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @param request - The related tags request to make.
 * @returns A Promise of RelatedTag[] that resolves when it fetches related tags.
 *
 * @public
 */
export const fetchRelatedTags: RelatedTagsXStoreModule['actions']['fetchRelatedTags'] = (
  _context,
  request
) => {
  return request ? XPlugin.adapter.relatedTags(request).then(({ relatedTags }) => relatedTags) : [];
};
