import type { TaggingRequest } from '../request'
import type { Result } from '../result'

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
 * Interface for the AI suggestion source.
 *
 * @internal
 */
export interface AiSuggestionSource {
  index: number
  type: string
  data: Result
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
      toolingDisplayAdd2Cart: TaggingRequest
    }
  >
}
