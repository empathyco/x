import { RelatedPromptsRequest } from '@empathyco/x-types';
import { RelatedPromptsXStoreModule } from '../types';

/**
 * Default implementation for the {@link RelatedPromptsActions.fetchAndSaveRelatedPrompts}.
 *
 * @param _context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @param query - The query to add to the related prompts request to make.
 * @returns A Promise of a RelatedPromptsResponse when it fetches the results.
 *
 * @public
 */
// eslint-disable-next-line max-len
export const fetchAndSaveRelatedPrompts: RelatedPromptsXStoreModule['actions']['fetchAndSaveRelatedPrompts'] =
  ({ dispatch, commit, state }, query) => {
    const request: RelatedPromptsRequest = {
      query,
      extraParams: {
        ...state.params
      }
    };

    return dispatch('fetchRelatedPrompts', request)
      .then(response => {
        if (response) {
          commit('setRelatedPromptsProducts', {
            products: response ?? [],
            query
          });
          commit('setStatus', 'success');
        }
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.error(error);
        commit('setStatus', 'error');
      });
  };
