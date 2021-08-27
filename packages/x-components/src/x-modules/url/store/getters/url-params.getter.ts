import { UrlXStoreModule } from '../types';

/**
 * Default implementation for the {@link UrlGetters.urlParams} getter.
 *
 * @param state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of the url module.
 * @returns The url params.
 *
 * @public
 */
export const urlParams: UrlXStoreModule['getters']['urlParams'] = ({
  query,
  page,
  filters,
  sort,
  relatedTag,
  ...extraParams
}) => {
  return {
    query,
    page,
    filters,
    sort,
    relatedTag,
    ...extraParams
  };
};
