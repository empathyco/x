import { XStoreModule } from '../../../store/store.types';
import { ExperienceControlsConfig } from '../config.types';

/**
 * Experience Controls store state.
 *
 * @public
 */
export interface ExperienceControlsState {
  /**
   * Configuration for the `ExperienceControls` module.
   */
  config: ExperienceControlsConfig;
}

/**
 * Experience Controls store getters.
 *
 * @public
 */
export interface ExperienceControlsGetters {
  getNumberCarousels(state: any): number;
  getResultsCarousels(state: any): number;
}

/**
 * Experience Controls store mutations.
 *
 * @public
 */
export interface ExperienceControlsMutations {
  /**
   * Sets the {@link ExperienceControlsState.config} property.
   *
   * @param experienceControlsConfig - The new {@link ExperienceControlsState.config}.
   */
  setExperienceControlsConfig(experienceControlsConfig: ExperienceControlsConfig): void;
}

export interface ExperienceControlsActions {}

/**
 * Experience Controls type safe store module.
 *
 * @public
 */
export type ExperienceControlsXStoreModule = XStoreModule<
  ExperienceControlsState,
  ExperienceControlsGetters,
  ExperienceControlsMutations,
  ExperienceControlsActions
>;
