import { RelatedTagsXStoreModule } from '../types';
/**
 * Default implementation for the {@link RelatedTagsGetters.request} getter.
 *
 * @param state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of the related
 * tags module.
 * @param getters - Current {@link https://vuex.vuejs.org/guide/getters.html | getters} of the
 * related tags module.
 *
 * @returns The related tags request to fetch data from the API.
 *
 * @public
 */
export const request: RelatedTagsXStoreModule['getters']['request'] = (
  { config, params },
  { query }
) => {
  return query.trim()
    ? {
        query,
        rows: config.maxItemsToRequest,
        start: 0,
        extraParams: params
      }
    : null;
};
