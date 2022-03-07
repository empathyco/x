import { setStatus } from '../../../store/utils/status-store.utils';
import {
  cancelFetchAndSaveRelatedTags,
  fetchAndSaveRelatedTags
} from './actions/fetch-and-save-related-tags.action';
import { fetchRelatedTags } from './actions/fetch-related-tags.action';
import { setUrlParams } from './actions/set-url-params.action';
import { toggleRelatedTag } from './actions/toggle-related-tag.action';
import { query } from './getters/query.getter';
import { relatedTags } from './getters/related-tags.getter';
import { request } from './getters/request.getter';
import { RelatedTagsXStoreModule } from './types';

/**
 * {@link XStoreModule} For the related tags module.
 *
 * @internal
 */

export const relatedTagsXStoreModule: RelatedTagsXStoreModule = {
  state: () => ({
    query: '',
    relatedTags: [],
    selectedRelatedTags: [],
    status: 'initial',
    config: {
      maxItemsToRequest: 10
    },
    params: {}
  }),
  getters: {
    request,
    relatedTags,
    query
  },
  mutations: {
    setQuery(state, newQuery) {
      state.query = newQuery;
    },
    setRelatedTags(state, relatedTags) {
      state.relatedTags = relatedTags;
    },
    setSelectedRelatedTags(state, selectedRelatedTags) {
      state.selectedRelatedTags = selectedRelatedTags;
    },
    setStatus,
    setParams(state, params) {
      state.params = params;
    }
  },
  actions: {
    cancelFetchAndSaveRelatedTags,
    fetchRelatedTags,
    fetchAndSaveRelatedTags,
    toggleRelatedTag,
    setUrlParams
  }
};
