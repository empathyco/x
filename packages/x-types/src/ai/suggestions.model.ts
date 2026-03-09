import type { TaggingRequest } from '../request'

/**
 * Data for each query suggested.
 * @public
 */
export interface AiSuggestionQuery {
  query: string
  categories: string[]
}

/**
 * Interface for the AI suggestion tagging.
 * @public
 */
export interface AiSuggestionTagging {
  toolingDisplay: TaggingRequest
  toolingDisplayClick: TaggingRequest
  searchQueries: Record<
    string,
    {
      toolingDisplay: TaggingRequest
      toolingDisplayClick: TaggingRequest
      toolingDisplayAdd2Cart: TaggingRequest
    }
  >
}
