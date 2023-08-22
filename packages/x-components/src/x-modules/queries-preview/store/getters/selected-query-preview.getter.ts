import { QueriesPreviewXStoreModule } from '../types';

/**
 * Default implementation for the {@link QueriesPreviewGetters.request} getter.
 *
 * @param state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of the queries
 * preview module.
 * @param getters - Current {@link https://vuex.vuejs.org/guide/getters.html | getters}
 * of the queries preview module.
 * @returns A query preview object or null if no selection was made.
 *
 * @public
 */

export const selectedQueryPreview: QueriesPreviewXStoreModule['getters']['selectedQueryPreview'] =
  ({ selectedQueryPreview, params }) => {
    return selectedQueryPreview.query
      ? {
          query: selectedQueryPreview.query,
          extraParams: selectedQueryPreview.extraParams
        }
      : {
          query: '',
          extraParams: params
        };
  };
