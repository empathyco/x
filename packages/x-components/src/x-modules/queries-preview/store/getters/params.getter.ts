import { QueriesPreviewXStoreModule } from '../types';

/**
 * Default implementation for the {@link QueriesPreviewGetters.params} getter.
 *
 * @param state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of the queries
 * preview module.
 * @param getters - Current {@link https://vuex.vuejs.org/guide/getters.html | getters}
 * of the queries preview module.
 *
 * @returns The initial params set in the module.
 *
 * @public
 */

export const params: QueriesPreviewXStoreModule['getters']['params'] = ({
  params,
  selectedQueryPreview
}) => {
  return selectedQueryPreview?.extraParams ?? params;
};
