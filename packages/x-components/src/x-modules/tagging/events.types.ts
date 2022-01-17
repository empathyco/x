import { TaggingInfo } from '@empathyco/x-types';

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
   * Consent has been provided.
   * * Payload: The new consent value.
   */
  ConsentProvided: boolean;
  /**
   * Query tagging debounce has been provided.
   * * Payload: The new query tagging debounce value.
   */
  QueryTaggingDebounceProvided: number;
  /**
   * Query tagging info has changed.
   * * Payload: The new query tagging info.
   */
  SearchTaggingReceived: TaggingInfo;
  /**
   * Session duration has been provided.
   * * Payload: The new session duration value.
   */
  SessionDurationProvided: number;

  /**
   * The time to store the information for a result clicked by the user has been provided.
   * * Payload: The new result storage duration value.
   */
  ClickedResultStorageDurationProvided: number;

  /**
   * The field of {@link @empathy/x-types#Result | result} to be use as id for
   * storing the information.
   * * Payload: The new id storage value.
   */
  ClickedResultStorageKeyProvided: string;

  /**
   * ClickedResultStorageKeyProvided has been configured to use the
   * {@link @empathy/x-types#Result | result} url.
   * * Payload: The new clickedResultStorageKey.
   */
  ResultURLTrackingEnabled: string;

  /**
   * A product description page has been loaded.
   * Payload: the id of the product.
   */
  PDPIsLoaded: string;
}
