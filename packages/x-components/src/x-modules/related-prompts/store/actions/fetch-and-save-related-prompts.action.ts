import { RelatedPromptsXStoreModule } from '../types';

/**
 * Default implementation for the {@link RelatedPromptsActions.fetchAndSaveRelatedPrompts}.
 *
 * @param _context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @param request - The related prompts request to make.
 * @returns A Promise of a RelatedPromptsResponse when it fetches the results.
 *
 * @public
 */
// eslint-disable-next-line max-len
export const fetchAndSaveRelatedPrompts: RelatedPromptsXStoreModule['actions']['fetchAndSaveRelatedPrompts'] =
  ({ dispatch, commit }, request) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { query } = request;
    if (!query) {
      return;
    }
    return dispatch('fetchRelatedPrompts', request)
      .then(response => {
        commit('setRelatedPromptsProducts', {
          products: response ?? [],
          query
        });
        commit('setStatus', 'success');
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.error(error);
        commit('setStatus', 'error');
      });
  };

/*const { fetchAndSave, cancelPrevious } = createFetchAndSaveActions<
  RelatedPromptsActionContext,
  RelatedPromptsRequest | null,
  RelatedPrompt[] | null
>({
  fetch({ dispatch }, request) {
    return dispatch('fetchRelatedPrompts', request);
  },
  onSuccess({ commit }, relatedPrompts) {
    if (relatedPrompts) {
      commit('setRelatedPromptsProducts', relatedPrompts);
    }
  }
});*/

/**
 * Default implementation for
 * {@link RelatedPromptsActions.fetchAndSaveRelatedPrompts} action.
 *
 * @public
 */
//export const fetchAndSaveRelatedPrompts = fetchAndSave;

/**
 * Default implementation for
 * {@link RelatedPromptsActions.cancelFetchAndSaveRelatedPrompts} action.
 *
 * @public
 */
//export const cancelFetchAndSaveRelatedPrompts = cancelPrevious;
