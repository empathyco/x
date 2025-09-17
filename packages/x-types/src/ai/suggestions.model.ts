import type { TaggingRequest } from '../request'

/**
 * Data for each query suggested.
 *
 * @internal
 */
export interface AiSuggestionQuery {
  query: string
  categories: string[]
}

/**
 * Interface for the AI suggestion tagging.
 *
 * @internal
 */
export interface AiSuggestionTagging {
  toolingDisplay: TaggingRequest
  toolingDisplayClick: TaggingRequest
  searchQueries: Record<
    string,
    {
      toolingDisplay: TaggingRequest
      toolingDisplayClick: TaggingRequest
    }
  >
}
