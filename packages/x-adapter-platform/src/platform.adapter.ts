// eslint-disable-next-line max-len
import { identifierResultsEndpointAdapter } from './endpoint-adapters/identifier-results.endpoint-adapter';
import { nextQueriesEndpointAdapter } from './endpoint-adapters/next-queries.endpoint-adapter';
// eslint-disable-next-line max-len
import { popularSearchesEndpointAdapter } from './endpoint-adapters/popular-searches.endpoint-adapter';
// eslint-disable-next-line max-len
import { querySuggestionsEndpointAdapter } from './endpoint-adapters/query-suggestions.endpoint-adapter';
// eslint-disable-next-line max-len
import { recommendationsEndpointAdapter } from './endpoint-adapters/recommendations.endpoint-adapter';
import { relatedTagsEndpointAdapter } from './endpoint-adapters/related-tags.endpoint-adapter';
import { searchEndpointAdapter } from './endpoint-adapters/search.endpoint-adapter';
import { taggingEndpointAdapter } from './endpoint-adapters/tagging.endpoint-adapter';
import { PlatformAdapter } from './types/platform-adapter.types';

export const platformAdapter: PlatformAdapter = {
  identifierResults: identifierResultsEndpointAdapter,
  nextQueries: nextQueriesEndpointAdapter,
  popularSearches: popularSearchesEndpointAdapter,
  querySuggestions: querySuggestionsEndpointAdapter,
  recommendations: recommendationsEndpointAdapter,
  relatedTags: relatedTagsEndpointAdapter,
  search: searchEndpointAdapter,
  tagging: taggingEndpointAdapter
};
