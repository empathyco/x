import { searchEndpointAdapter } from './endpoint-adapters/search.endpoint-adapter';
import { PlatformAdapter } from './types/platform-adapter.types';
// eslint-disable-next-line max-len
import { popularSearchesEndpointAdapter } from './endpoint-adapters/popular-searches.endpoint-adapter';
import { topClickedEndpointAdapter } from './endpoint-adapters/top-clicked.endpoint-adapter';
import { nextQueriesEndpointAdapter } from './endpoint-adapters/next-queries.endpoint-adapter';
import { relatedTagsEndpointAdapter } from './endpoint-adapters/related-tags.endpoint-adapter';
import { skuSearchEndpointAdapter } from './endpoint-adapters/sku-search.endpoint-adapter';
import { taggingEndpointAdapter } from './endpoint-adapters/tagging.endpoint-adapter';
// eslint-disable-next-line max-len
import { querySuggestionsEndpointAdapter } from './endpoint-adapters/query-suggestions.endpoint-adapter';

export const platformAdapter: PlatformAdapter = {
  search: searchEndpointAdapter,
  popularSearches: popularSearchesEndpointAdapter,
  topClicked: topClickedEndpointAdapter,
  nextQueries: nextQueriesEndpointAdapter,
  querySuggestions: querySuggestionsEndpointAdapter,
  relatedTags: relatedTagsEndpointAdapter,
  skuSearch: skuSearchEndpointAdapter,
  tagging: taggingEndpointAdapter
};
