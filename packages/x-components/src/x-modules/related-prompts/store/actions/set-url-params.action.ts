import { RelatedPromptsXStoreModule } from '../types';

/**
 * Default implementation for the {@link RelatedPromptsActions.setUrlParams}.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 *
 * @param urlParams - List of params from the url.
 *
 * @public
 */
export const setUrlParams: RelatedPromptsXStoreModule['actions']['setUrlParams'] = (
  { commit },
  { prompt, query }
) => {
  commit('setQuery', query);
  commit('setSelectedPrompt', prompt);
};
