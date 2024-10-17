import { RelatedPromptsRequest } from '@empathyco/x-types';

/**
 * Dictionary of the events of RelatedPrompts XModule, where each key is the event name,
 * and the value is the event payload type or `void` if it has no payload.
 */
export interface RelatedPromptsXEvents {
  /**
   * Any property of the related-prompts request has changed
   * Payload: The new related-prompts request or `null` if there is not enough data in the state
   * to conform a valid request.
   */
  RelatedPromptsRequestUpdated: RelatedPromptsRequest | null;
}
