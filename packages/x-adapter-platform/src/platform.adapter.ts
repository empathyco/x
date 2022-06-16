import { searchEndpointAdapter } from './endpoint-adapters/search.endpoint-adapter';
import { PlatformAdapter } from './types/platform-adapter.types';
// eslint-disable-next-line max-len
import { popularSearchesEndpointAdapter } from './endpoint-adapters/popular-searches.endpoint-adapter';
// eslint-disable-next-line max-len
import { recommendationsEndpointAdapter } from './endpoint-adapters/recommendations.endpoint-adapter';
import { nextQueriesEndpointAdapter } from './endpoint-adapters/next-queries.endpoint-adapter';
import { relatedTagsEndpointAdapter } from './endpoint-adapters/related-tags.endpoint-adapter';
// eslint-disable-next-line max-len
import { identifierResultsEndpointAdapter } from './endpoint-adapters/identifier-results.endpoint-adapter';
import { taggingEndpointAdapter } from './endpoint-adapters/tagging.endpoint-adapter';
// eslint-disable-next-line max-len
import { querySuggestionsEndpointAdapter } from './endpoint-adapters/query-suggestions.endpoint-adapter';

export const platformAdapter: PlatformAdapter = {
  search: searchEndpointAdapter,
  popularSearches: popularSearchesEndpointAdapter,
  recommendations: recommendationsEndpointAdapter,
  nextQueries: nextQueriesEndpointAdapter,
  querySuggestions: querySuggestionsEndpointAdapter,
  relatedTags: relatedTagsEndpointAdapter,
  identifierResults: identifierResultsEndpointAdapter,
  tagging: taggingEndpointAdapter
};
