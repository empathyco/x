import type {
  PlatformAiSuggestionSearch,
  PlatformAiSuggestionSearchTagging,
} from '../../models/ai/suggestion-search.model'

/**
 * Response for the `AI suggestions search` endpoint.
 *
 * @public
 */
export interface PlatformAiSuggestionsSearchResponse {
  items: PlatformAiSuggestionSearch[]
  tagging: PlatformAiSuggestionSearchTagging
}
