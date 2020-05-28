import { RelatedTagsXStoreModule } from '../types';

/**
 * Default implementation for the {@link RelatedTagsActions.fetchAndSaveRelatedTags}.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @returns A `void` promise that resolves when the related tags finishes updating.
 *
 * @public
 */
//eslint-disable-next-line max-len
export const fetchAndSaveRelatedTags: RelatedTagsXStoreModule['actions']['fetchAndSaveRelatedTags'] = ({
  dispatch,
  commit
}) => dispatch('fetchRelatedTags').then(relatedTags => commit('setRelatedTags', relatedTags));
