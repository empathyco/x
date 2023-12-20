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
export const loadedQueriesPreview: QueriesPreviewXStoreModule['getters']['loadedQueriesPreview'] =
  ({ queriesPreviewCached, queriesPreviewNonCached }) => {
    const cachedQueries = objectFilter(queriesPreviewCached, (_, preview) => {
      return preview.status === 'success' && preview.totalResults > 0;
    });

    const nonCachedQueries = objectFilter(queriesPreviewNonCached, (_, preview) => {
      return preview.status === 'success' && preview.totalResults > 0;
    });

    return Object.fromEntries(
      Object.entries(cachedQueries).concat(Object.entries(nonCachedQueries))
    );
  };
