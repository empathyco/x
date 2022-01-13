import { Result, TaggingInfo } from '@empathyco/x-types';
import { XStoreModule } from '../../../store';
import { TaggingConfig } from '../config.types';
/**
 * Tagging store state.
 *
 * @public
 */
export interface TaggingState {
  /**
   * The current consent for tracking.
   */
  consent: boolean | null;
  /**
   * Configuration for the `Tagging` module.
   */
  config: TaggingConfig;
  /**
   * Tagging info for last accepted query.
   */
  queryTaggingInfo: TaggingInfo | null;
}

/**
 * Tagging store getters.
 *
 * @public
 */
export interface TaggingGetters {}

/**
 * Tagging store mutations.
 *
 * @public
 */
export interface TaggingMutations {
  /**
   * Sets the {@link TaggingState.consent } property.
   *
   * @param consent - The new {@link TaggingState.consent }.
   */
  setConsent(consent: boolean): void;
  /**
   * Sets the {@link TaggingConfig.sessionTTLMs } property.
   *
   * @param sessionTTLMs - The new {@link TaggingConfig.sessionTTLMs }.
   */
  setSessionDuration(sessionTTLMs: number): void;
  /**
   * Sets the {@link TaggingConfig.queryTaggingDebounceMs } property.
   *
   * @param queryTaggingDebounceMs - The new {@link TaggingConfig.queryTaggingDebounceMs }.
   */
  setQueryTaggingDebounce(queryTaggingDebounceMs: number): void;

  /**
   * Sets the {@link TaggingState.queryTaggingInfo} property.
   *
   * @param queryTaggingInfo - The new {@link TaggingState.queryTaggingInfo}.
   */
  setQueryTaggingInfo(queryTaggingInfo: TaggingInfo): void;

  setClickedResultStorageKey(clickedResultStorageKey: string): void;
  setClickedResultStorageTTL(clickedResultStorageTTL: number): void;
}

/**
 * Tagging store actions.
 *
 * @public
 */
export interface TaggingActions {
  /**
   * Tracks a user interaction.
   *
   * @param tagging - The information of the event to track.
   */
  track(tagging: TaggingInfo | TaggingInfo[]): void;
  /**
   * Tracks that a result was added to cart from PDP.
   *
   * @param result - The result added to cart.
   */
  trackPDPAddToCart(result: Result): void;
}

/**
 * Tagging type safe store module.
 *
 * @public
 */
export type TaggingXStoreModule = XStoreModule<
  TaggingState,
  TaggingGetters,
  TaggingMutations,
  TaggingActions
>;
