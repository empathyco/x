import { SearchXStoreModule } from '../types';

/**
 * Default implementation for the {@link SearchGetters.request} getter.
 *
 * @param state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of the search
 * module.
 * @returns The search request to fetch data from the API.
 *
 * @public
 */
export const request: SearchXStoreModule['getters']['request'] = ({
  query,
  params,
  config,
  relatedTags,
  selectedFilters,
  sort,
  page,
  origin,
  isAppendResults
}) => {
  const newOrigin = origin === null ? undefined : origin;
  return query.trim()
    ? {
        query,
        relatedTags,
        sort,
        rows: isAppendResults ? config.pageSize : config.pageSize * page,
        start: isAppendResults ? config.pageSize * (page - 1) : 0,
        origin: newOrigin,
        filters: selectedFilters,
        ...params
      }
    : null;
};
