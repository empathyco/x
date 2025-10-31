import type { PlatformAdapter } from './types/platform-adapter.types'
import { aiQuestionsEndpointAdapter } from './endpoint-adapters/ai/questions.endpoint-adapter'
import { aiSuggestionsSearchEndpointAdapter } from './endpoint-adapters/ai/suggestions-search.endpoint-adapter'
import { aiSuggestionsEndpointAdapter } from './endpoint-adapters/ai/suggestions.endpoint-adapter'
import { aiSummarizeEndpointAdapter } from './endpoint-adapters/ai/summarize.endpoint-adapter'
import { aiTasksEndpointAdapter } from './endpoint-adapters/ai/tasks.endpoint-adapter'
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
  aiSuggestions: aiSuggestionsEndpointAdapter,
  aiSummarize: aiSummarizeEndpointAdapter,
  aiSuggestionsSearch: aiSuggestionsSearchEndpointAdapter,
  aiQuestions: aiQuestionsEndpointAdapter,
  aiTasks: aiTasksEndpointAdapter,
}
