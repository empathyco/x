import type { AiSuggestionsRequest, AiSuggestionsSearchRequest, Result } from '@empathyco/x-types'

/**
 * Dictionary of the events of AI XModule, where each key is the event name, and the value is
 * the event payload type or `void` if it has no payload.
 *
 * @public
 */
export interface AiXEvents {
  AiSuggestionsRequestUpdated: AiSuggestionsRequest | null
  AiSuggestionsSearchRequestUpdated: AiSuggestionsSearchRequest | null
  UserClickedAiOverviewExpandButton: boolean
  UserClickedAnAiOverviewResult: Result
}
