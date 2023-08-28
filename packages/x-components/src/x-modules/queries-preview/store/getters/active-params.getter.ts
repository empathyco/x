import { objectFilter } from '@empathyco/x-utils';
import { QueriesPreviewXStoreModule } from '../types';

/**
 * Default implementation for the {@link QueriesPreviewGetters.loadedQueriesPreview} getter.
 *
 * @param state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of
 * the queries preview module.
 *
 * @returns The loaded previews from the state.
 */
export const activeParams: QueriesPreviewXStoreModule['getters']['activeParams'] =
  ({ params, selectedQueryPreview}) => {
    return !selectedQueryPreview ? params : selectedQueryPreview.extraParams!
  };
