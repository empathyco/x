import { TaggingRequest } from '@empathyco/x-types';
import { XStoreModule } from '../../../store';
import { TaggingConfig } from '../config.types';
import { ConfigMutations } from '../../../store/utils/config-store.utils';
import { XModuleName } from '../../x-modules.types';
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
   * Value to know if Semantics module is register.
   */
  hasSemantics: boolean;
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
  /**
   * Sets the totalHits property.
   *
   * @param totalHits - The new value of totalHits in {@link TaggingState.queryTaggingInfo}.
   */
  updateTotalHits(totalHits: string): void;
  /**
   * Sets the hasSemantics property.
   *
   * @param module - The name of the register module.
   */
  setHasSemantics(module: XModuleName): void;
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
  /**
   * Filters queryTagging and tracks user interaction.
   *
   * @param tagging - The information of the event to track.
   */
  trackQueryWithResults(tagging: TaggingRequest | TaggingRequest[]): void;
  /**
   * Updates query tagging information.
   *
   * @param tagging - The information of the event to update and set.
   */
  updateQueryTaggingInfo(tagging: SemanticsQueryTaggingPayload): void;
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

/**
 * Payload to use in the `updateQueryTaggingInfo` action.
 *
 * @public
 */
export interface SemanticsQueryTaggingPayload {
  /**
   * The query tagging info.
   */
  queryTagging: TaggingRequest;
  /**
   * The param to modify.
   */
  totalHits: string;
}
