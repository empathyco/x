import type { EndpointAdapterOptions } from '@empathyco/x-adapter'
import type { PlatformAdapter } from './types/platform-adapter.types'
import { experienceControlsEndpointAdapter } from './endpoint-adapters/experience-controls.endpoint-adapter'
import { identifierResultsEndpointAdapter } from './endpoint-adapters/identifier-results.endpoint-adapter'
import { nextQueriesEndpointAdapter } from './endpoint-adapters/next-queries.endpoint-adapter'
import { popularSearchesEndpointAdapter } from './endpoint-adapters/popular-searches.endpoint-adapter'
import { querySuggestionsEndpointAdapter } from './endpoint-adapters/query-suggestions.endpoint-adapter'
import { recommendationsEndpointAdapter } from './endpoint-adapters/recommendations.endpoint-adapter'
import { relatedPromptsEndpointAdapter } from './endpoint-adapters/related-prompts.endpoint-adapter'
import { relatedTagsEndpointAdapter } from './endpoint-adapters/related-tags.endpoint-adapter'
import { searchEndpointAdapter } from './endpoint-adapters/search.endpoint-adapter'
import { semanticQueriesEndpointAdapter } from './endpoint-adapters/semantic-queries.endpoint-adapter'
import { taggingEndpointAdapter } from './endpoint-adapters/tagging.endpoint-adapter'

const endpointAdapterOptions: EndpointAdapterOptions<Request, Response> = {
  defaultRequestOptions: {
    properties: {
      headers: {
        'x-empathy-origin': location?.origin,
      },
    },
  },
}

/**
 * Default implementation for the PlatformAdapter.
 *
 * @public
 */
export const platformAdapter: PlatformAdapter = {
  search: searchEndpointAdapter.extends(endpointAdapterOptions),
  popularSearches: popularSearchesEndpointAdapter.extends(endpointAdapterOptions),
  recommendations: recommendationsEndpointAdapter.extends(endpointAdapterOptions),
  nextQueries: nextQueriesEndpointAdapter.extends(endpointAdapterOptions),
  querySuggestions: querySuggestionsEndpointAdapter.extends(endpointAdapterOptions),
  relatedPrompts: relatedPromptsEndpointAdapter.extends(endpointAdapterOptions),
  relatedTags: relatedTagsEndpointAdapter.extends(endpointAdapterOptions),
  identifierResults: identifierResultsEndpointAdapter.extends(endpointAdapterOptions),
  tagging: taggingEndpointAdapter.extends(endpointAdapterOptions),
  semanticQueries: semanticQueriesEndpointAdapter.extends(endpointAdapterOptions),
  experienceControls: experienceControlsEndpointAdapter.extends(endpointAdapterOptions),
}
