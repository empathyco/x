import { searchEndpointAdapter } from './endpoint-adapters/search.endpoint-adapter';
import { PlatformAdapter } from './types/platform-adapter.types';
import { topClickedEndpointAdapter } from './endpoint-adapters/top-clicked.endpoint-adapter';
import { nextQueriesEndpointAdapter } from './endpoint-adapters/next-queries.endpoint-adapter';
import { relatedTagsEndpointAdapter } from './endpoint-adapters/related-tags.endpoint-adapter';
// eslint-disable-next-line max-len
import { identifierResultsEndpointAdapter } from './endpoint-adapters/identifier-results.endpoint-adapter';
import { taggingEndpointAdapter } from './endpoint-adapters/tagging.endpoint-adapter';

export const platformAdapter: PlatformAdapter = {
  identifierResults: identifierResultsEndpointAdapter,
  nextQueries: nextQueriesEndpointAdapter,
  popularSearches: topClickedEndpointAdapter,
  relatedTags: relatedTagsEndpointAdapter,
  search: searchEndpointAdapter,
  tagging: taggingEndpointAdapter
};
