/**
 * Dictionary of the events of Tagging XModule, where each key is the event name, and the value is
 * the event payload type or `void` if it has no payload.
 *
 * @public
 */
export interface TaggingXEvents {
  /**
   * Consent has changed.
   * * Payload: The new consent value.
   */
  ConsentChanged: boolean;
  /**
   * Page has been provided.
   * * Payload: The new consent value.
   */
  ConsentProvided: boolean;
}
