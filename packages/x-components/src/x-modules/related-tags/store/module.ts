import { fetchAndSaveRelatedTags } from './actions/fetch-and-save-related-tags.action';
import { fetchRelatedTags } from './actions/fetch-related-tags.action';
import { toggleRelatedTag } from './actions/toggle-related-tag.action';
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
    config: {
      maxItemsToRequest: 10
    }
  }),
  getters: {
    request,
    relatedTags
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
    }
  },
  actions: {
    fetchRelatedTags,
    fetchAndSaveRelatedTags,
    toggleRelatedTag
  }
};
