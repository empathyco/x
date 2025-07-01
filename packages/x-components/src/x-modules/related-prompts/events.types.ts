import type { RelatedPrompt, RelatedPromptsRequest, Result } from '@empathyco/x-types'

/**
 * Dictionary of the events of RelatedPrompts XModule, where each key is the event name,
 * and the value is the event payload type or `void` if it has no payload.
 *
 * @public
 */
export interface RelatedPromptsXEvents {
  /**
   * Any property of the related-prompts request has changed
   * Payload: The new related-prompts request or `null` if there is not enough data in the state
   * to conform a valid request.
   */
  RelatedPromptsRequestUpdated: RelatedPromptsRequest | null
  /**
   * Selected Related Prompt has been changed.
   * Payload: Selected Related Prompt index. -1 is deselected.
   */
  SelectedRelatedPromptChanged: number
  /**
   * The selected prompt has changed.
   * Payload: The index of the prompt in the RelatedPrompts list or -1 to remove selection.
   */
  UserSelectedARelatedPrompt: number
  /**
   * The selected next query of the selected prompt has changed.
   * Payload: The index of the next query in the NextQueries list or -1 to remove selection.
   */
  UserSelectedARelatedPromptQuery: number
  /**
   * The user has clicked one prompt.
   * Payload: The result that the user clicked.
   */
  UserClickedARelatedPromptResult: Result
  /**
   * The user has clicked one add to cart from a prompt.
   * Payload: The result that the user clicked.
   */
  UserClickedARelatedPromptAdd2Cart: Result
  /**
   * The response list of related prompts has changed.
   * Payload: The new related-prompts list.
   */
  RelatedPromptsResponseChanged: RelatedPrompt[]
  /**
   * The related prompts has been unmounted.
   */
  RelatedPromptsUnmounted: void
  /**
   * Reload the current related prompts that have been requested.
   */
  ReloadRelatedPromptsRequested: void
}
