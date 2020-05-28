import { XPlugin } from '../../../../plugins/x-plugin';
import { RelatedTagsXStoreModule } from '../types';

/**
 * Default implementation for the {@link RelatedTagsActions.fetchRelatedTags}.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @returns A Promise of RelatedTag[] that resolves when it fetches related tags.
 *
 * @public
 */
export const fetchRelatedTags: RelatedTagsXStoreModule['actions']['fetchRelatedTags'] = ({
  getters
}) => {
  return getters.request
    ? XPlugin.adapter.getRelatedTags(getters.request).then(({ relatedTags }) => relatedTags)
    : [];
};
