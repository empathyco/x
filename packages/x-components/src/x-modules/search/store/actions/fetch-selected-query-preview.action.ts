import { XPlugin } from '../../../../plugins/x-plugin';
import { SearchXStoreModule } from '../types';

/**
 * Default implementation for the {@link SearchActions.fetchSearchResponse}.
 *
 * @param dispatch - The {@link https://vuex.vuejs.org/guide/actions.html | dispatch} to perform,
 * provided by Vuex.
 * @param payload - The information to send within the request.
 * @returns A Promise of search response that resolves when it fetches search response.
 *
 * @public
 */
export const fetchSelectedQueryPreview: SearchXStoreModule['actions']['fetchSelectedQueryPreview'] =
  ({ commit, dispatch }, payload) => {
    const { extraParams, query } = payload;
    XPlugin.adapter
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      .search(payload, {
        parameters: extraParams
      })
      .then(response => {
        commit('setQuery', query);
        commit('setParams', { ...extraParams });
        dispatch('saveSearchResponse', response);
      });
  };
