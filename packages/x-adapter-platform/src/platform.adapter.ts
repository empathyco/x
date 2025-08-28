import type { PlatformAdapter } from './types/platform-adapter.types'
import {
  aiOverviewSuggestionsSearchEndpointAdapter,
  aiQuestionsEndpointAdapter,
  aiTasksEndpointAdapter,
} from './endpoint-adapters/ai'
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
  relatedPrompts: relatedPromptsEndpointAdapter,
  relatedTags: relatedTagsEndpointAdapter,
  identifierResults: identifierResultsEndpointAdapter,
  tagging: taggingEndpointAdapter,
  semanticQueries: semanticQueriesEndpointAdapter,
  experienceControls: experienceControlsEndpointAdapter,
  aiOverviewSuggestionsSearch: aiOverviewSuggestionsSearchEndpointAdapter,
  aiQuestions: aiQuestionsEndpointAdapter,
  aiTasks: aiTasksEndpointAdapter,
}
