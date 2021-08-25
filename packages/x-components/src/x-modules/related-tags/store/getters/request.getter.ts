import { RelatedTagsXStoreModule } from '../types';
/**
 * Default implementation for the {@link RelatedTagsGetters.request} getter.
 *
 * @param state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of the related
 * tags module.
 *
 * @returns The related tags request to fetch data from the API.
 *
 * @public
 */
export const request: RelatedTagsXStoreModule['getters']['request'] = ({
  query,
  selectedRelatedTags,
  config,
  params
}) => {
  return query.trim()
    ? {
        query,
        relatedTags: selectedRelatedTags,
        rows: config.maxItemsToRequest,
        start: 0,
        ...params
      }
    : null;
};
