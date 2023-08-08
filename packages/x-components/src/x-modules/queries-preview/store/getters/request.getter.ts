import { QueriesPreviewXStoreModule } from '../types';

/**
 * Default implementation for the {@link QueriesPreviewGetters.request} getter.
 *
 * @param state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of the queries
 * preview module.
 * @param getters - Current {@link https://vuex.vuejs.org/guide/getters.html | getters}
 * of the queries preview module.
 * @returns The search request to fetch data from the API.
 *
 * @public
 */

export const request: QueriesPreviewXStoreModule['getters']['request'] = ({
  selectedQueryPreview
}) => {
  return selectedQueryPreview
    ? {
        query: selectedQueryPreview.query,
        extraParams: selectedQueryPreview.extraParams,
        page: 1
      }
    : null;
};
