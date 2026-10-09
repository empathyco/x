import type {
  AiSuggestionSearch,
  AiSuggestionSearchTagging,
  AiSuggestionsRequest,
  AiSuggestionsSearchRequest,
  Result,
} from '@empathyco/x-types'

/**
 * Dictionary of the events of AI XModule, where each key is the event name, and the value is
 * the event payload type or `void` if it has no payload.
 *
 * @public
 */
export interface AiXEvents {
  AiSuggestionsRequestUpdated: AiSuggestionsRequest | null
  AiSuggestionsSearchRequestUpdated: AiSuggestionsSearchRequest | null
  AiSuggestionsSearchChanged: AiSuggestionSearch[]
  AiSuggestionsSearchTaggingChanged: AiSuggestionSearchTagging
  UserClickedAnAiCarouselResult: Result
  UserClickedAnAiCarouselAdd2Cart: Result
  AiComponentMounted: void
  AiComponentUnmounted: void
}
