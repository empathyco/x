import { XEventsTypes } from '../../../wiring';
import { XStoreModule } from '../../../store/store.types';
import { XActionContext } from '../../../store';
/**
 * Experience Controls store state.
 *
 * @public
 */
export interface ExperienceControlsState {
  /**
   * Configuration for the `ExperienceControls` module.
   */
  controls: { [key: string]: unknown };
  events: Partial<XEventsTypes>;
}

/**
 * Experience Controls store getters.
 *
 * @public
 */
export interface ExperienceControlsGetters {}

/**
 * Experience Controls store mutations.
 *
 * @public
 */
export interface ExperienceControlsMutations {
  /**
   * Sets the {@link ExperienceControlsState.controls} property.
   *
   * @param experienceControlsConfig - The new {@link ExperienceControlsState.config}.
   */
  setControls(controls: { [key: string]: unknown }): void;
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

/**
 * Alias type for actions context of the {@link ExperienceControlsXStoreModule}.
 *
 * @public
 */
export type ExperienceControlsActionContext = XActionContext<
  ExperienceControlsState,
  ExperienceControlsGetters,
  ExperienceControlsMutations,
  ExperienceControlsActions
>;
