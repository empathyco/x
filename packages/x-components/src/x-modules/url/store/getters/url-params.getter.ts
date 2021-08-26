/**
 * Default implementation for the {@link UrlGetters.urlParams} getter.
 *
 * @param state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of the url module.
 * @returns The url params.
 *
 * @public
 */
import { UrlXStoreModule } from '../types';

export const request: UrlXStoreModule['getters']['urlParams'] = ({
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
