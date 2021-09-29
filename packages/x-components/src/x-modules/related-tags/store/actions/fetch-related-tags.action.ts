import { XPlugin } from '../../../../plugins/x-plugin';
import { RelatedTagsXStoreModule } from '../types';

/**
 * Default implementation for the {@link RelatedTagsActions.fetchRelatedTags}.
 *
 * @param _ - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @param request - The related tags request to make.
 * @returns A Promise of RelatedTag[] that resolves when it fetches related tags.
 *
 * @public
 */
export const fetchRelatedTags: RelatedTagsXStoreModule['actions']['fetchRelatedTags'] = (
  _,
  request
) => {
  return request
    ? XPlugin.adapter.getRelatedTags(request).then(({ relatedTags }) => relatedTags)
    : [];
};
