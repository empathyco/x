import type { AiSuggestionSearch } from '../../ai'

/**
 * Response for the AI suggestions search endpoint.
 * @public
 */
export interface AiSuggestionsSearchResponse {
  suggestions: AiSuggestionSearch[]
}
