/* eslint-disable max-len */
import { searchEndpointAdapter } from './endpoint-adapters/search.endpoint-adapter';
import { PlatformAdapter } from './types/platform-adapter.types';
import { popularSearchesEndpointAdapter } from './endpoint-adapters/popular-searches.endpoint-adapter';
import { recommendationsEndpointAdapter } from './endpoint-adapters/recommendations.endpoint-adapter';
import { nextQueriesEndpointAdapter } from './endpoint-adapters/next-queries.endpoint-adapter';
import { relatedTagsEndpointAdapter } from './endpoint-adapters/related-tags.endpoint-adapter';
import { identifierResultsEndpointAdapter } from './endpoint-adapters/identifier-results.endpoint-adapter';
import { taggingEndpointAdapter } from './endpoint-adapters/tagging.endpoint-adapter';
import { querySuggestionsEndpointAdapter } from './endpoint-adapters/query-suggestions.endpoint-adapter';
import { semanticQueriesEndpointAdapter } from './endpoint-adapters/semantic-queries.endpoint-adapter';
import { experienceControlsEndpointAdapter } from './endpoint-adapters/experience-controls.endpoint-adapter';
/* eslint-enable max-len */

/**
 * Default implementation for the PlatformAdapter.
 *
 * @public
 */
export const platformAdapter: PlatformAdapter = {
  search: searchEndpointAdapter,
  popularSearches: popularSearchesEndpointAdapter,
  recommendations: recommendationsEndpointAdapter,
  nextQueries: nextQueriesEndpointAdapter,
  querySuggestions: querySuggestionsEndpointAdapter,
  relatedTags: relatedTagsEndpointAdapter,
  identifierResults: identifierResultsEndpointAdapter,
  tagging: taggingEndpointAdapter,
  semanticQueries: semanticQueriesEndpointAdapter,
  experienceControls: experienceControlsEndpointAdapter
};
