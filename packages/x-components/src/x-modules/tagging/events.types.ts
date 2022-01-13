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

  ClickedResultStorageDurationProvided: number;

  ClickedResultStorageKeyProvided: string;

  ResultURLTrackingEnabled: string;

  PDPIsLoaded: string;
}
