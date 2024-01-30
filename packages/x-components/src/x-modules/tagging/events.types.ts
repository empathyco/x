import { Taggable, TaggingRequest } from '@empathyco/x-types';
import { TaggingConfig } from './config.types';

/**
 * Dictionary of the events of Tagging XModule, where each key is the event name, and the value is
 * the event payload type or `void` if it has no payload.
 *
 * @public
 */
export interface TaggingXEvents {
  /**
   * Consent has changed.
   * Payload: The new consent value.
   */
  ConsentChanged: boolean;
  /**
   * Consent has been provided.
   * Payload: The new consent value.
   */
  ConsentProvided: boolean;
  /**
   * A product description page has been loaded.
   * Payload: the id of the product.
   */
  PDPIsLoaded: string;
  /**
   * ClickedResultStorageKey has been configured to use the
   * {@link @empathyco/x-types#Result | result} url.
   * Payload: The new clickedResultStorageKey.
   */
  ResultURLTrackingEnabled: string;
  /**
   * Query tagging info has changed.
   * Payload: The new query tagging info.
   */
  SearchTaggingReceived: TaggingRequest;
  /**
   * Display trackable element has appeared in the viewport.
   * Payload: The display tagging info.
   */
  TrackableElementDisplayed: Taggable;
  /**
   * The user has clicked on the add to cart button from PDP.
   * Payload: The id of the {@link @empathyco/x-types#Result | result} that the user clicked.
   */
  UserClickedPDPAddToCart: string | undefined;
  /**
   * The configuration for the tagging has been provided.
   * Payload: The tagging configuration.
   */
  TaggingConfigProvided: TaggingConfig;
}
