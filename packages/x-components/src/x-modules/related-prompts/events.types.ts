import { RelatedPromptsRequest } from '@empathyco/x-types';
import { FeatureLocation } from '../../types/index';

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
  RelatedPromptsRequestUpdated: RelatedPromptsRequest | null;
  /**
   * The selected prompt has changed.
   * Payload: The index of the prompt in the RelatedPrompts list or -1 to remove selection.
   */
  UserSelectedARelatedPrompt: { promptId: string; query: string };
  /**
   * The selected next query of the selected prompt has changed.
   * Payload: The index of the next query in the NextQueries list or -1 to remove selection.
   */
  UserSelectedARelatedPromptQuery: number;
  /**
   * A custom query to request has been provided.
   * Payload: The query to add to the request.
   */
  RelatedPromptsCustomQueryProvider: string;
  /**
   * The current location of the related prompts.
   * Payload: The query to request prompts and the location of the related-prompts.
   */
  RelatedPromptsLocation: { location: FeatureLocation | undefined; query: string };
}
