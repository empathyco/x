import { TaggingInfo } from '@empathyco/x-types';
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
}

/**
 * Tagging store actions.
 *
 * @public
 */
export interface TaggingActions {
  /**
   * Tracks the tagging of the query.
   *
   */
  trackTagging(tagging: TaggingInfo | TaggingInfo[]): void;
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
