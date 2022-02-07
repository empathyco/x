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
   * Sets the {@link TaggingState.queryTaggingInfo} property.
   *
   * @param queryTaggingInfo - The new {@link TaggingState.queryTaggingInfo}.
   */
  setQueryTaggingInfo(queryTaggingInfo: TaggingInfo): void;

  /**
   * Sets the {@link TaggingState.config} property.
   *
   * @param taggingConfig - The new {@link TaggingState.config}.
   */
  setTaggingConfig(taggingConfig: TaggingConfig): void;
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
