import type { TaggingRequest } from '@empathyco/x-types'
import type { XStoreModule } from '../../../store'
import type { ConfigMutations } from '../../../store/utils/config-store.utils'
import type { XModuleName } from '../../x-modules.types'
import type { TaggingConfig } from '../config.types'
/**
 * Tagging store state.
 *
 * @public
 */
export interface TaggingState {
  /**
   * The current consent for tracking.
   */
  consent: boolean | null
  /**
   * Flag to enable the tagging of the fallback solution to
   * no results page.
   */
  noResultsTaggingEnabled: boolean
  /**
   * Configuration for the `Tagging` module.
   */
  config: TaggingConfig
  /**
   * Tagging info for last accepted query.
   */
  queryTaggingInfo: TaggingRequest | null
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
  setConsent: (consent: boolean) => void
  /**
   * Sets the {@link TaggingState.queryTaggingInfo} property.
   *
   * @param queryTaggingInfo - The new {@link TaggingState.queryTaggingInfo}.
   */
  setQueryTaggingInfo: (queryTaggingInfo: TaggingRequest) => void
  /**
   * Sets the noResultsTaggingEnabled property.
   *
   * @param module - The name of the register module.
   */
  setNoResultsTaggingEnabled: (module: XModuleName) => void
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
  track: (tagging: TaggingRequest | TaggingRequest[]) => void
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
>
