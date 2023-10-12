import { TaggingRequest } from '@empathyco/x-types';
import { XStoreModule } from '../../../store';
import { TaggingConfig } from '../config.types';
import { ConfigMutations } from '../../../store/utils/config-store.utils';
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
  queryTaggingInfo: TaggingRequest | null;
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
export interface TaggingMutations extends ConfigMutations<TaggingState> {
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
  setQueryTaggingInfo(queryTaggingInfo: TaggingRequest): void;
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
  track(tagging: TaggingRequest | TaggingRequest[]): void;
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
