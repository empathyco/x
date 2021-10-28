import { urlParams } from './getters/url-params.getter';
import { initialUrlState } from './initial-state';
import { setParams } from './mutations/set-params.mutation';
import { UrlXStoreModule } from './types';

/**
 * {@link XStoreModule} For the URL module.
 *
 * @internal
 */
export const urlXStoreModule: UrlXStoreModule = {
  state: () => ({
    ...initialUrlState,
    initialExtraParams: {}
  }),
  getters: {
    urlParams
  },
  mutations: {
    setParams,
    setQuery(state, query) {
      state.query = query;
    },
    setRelatedTags(state, relatedTags) {
      state.tag = relatedTags.map(relatedTag => relatedTag.tag);
    },
    setFilters(state, newFilters) {
      state.filter = newFilters.map(filter => filter.id as string);
    },
    setPage(state, page) {
      state.page = page;
    },
    setSort(state, sort) {
      state.sort = sort;
    },
    setInitialExtraParams(state, extraParams) {
      state.initialExtraParams = extraParams;
    }
  },
  actions: {}
};
