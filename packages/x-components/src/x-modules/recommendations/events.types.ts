import { Result, RecommendationsRequest } from '@empathyco/x-types';

/**
 * Dictionary of the events of Recommendations XModule, where each key is the event name, and the
 * value is the event payload type or `void` if it has no payload.
 *
 * @public
 */
export interface RecommendationsXEvents {
  /**
   * Recommendations have been changed.
   * Payload: The new {@link @empathyco/x-types#Result | recommendations}.
   */
  RecommendationsChanged: Result[];
  /**
   * Any property of the recommendations request has changed.
   * Payload: The new recommendations request or `null` if there is not enough data in the state
   * to conform a valid request.
   */
  RecommendationsRequestChanged: RecommendationsRequest;
  /**
   * A recommendation result has been clicked.
   * Payload: The {@link @empathyco/x-types#Result | result}.
   */
  UserClickedARecommendation: Result;
}
