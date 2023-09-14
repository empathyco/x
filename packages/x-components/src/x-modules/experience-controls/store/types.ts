import { XEventsTypes } from '../../../wiring';
import { XStoreModule } from '../../../store/store.types';
import { StatusState, XActionContext } from '../../../store';
/**
 * Experience Controls store state.
 *
 * @public
 */
export interface ExperienceControlsState extends StatusState {
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

export interface ExperienceControlsActions {
  /**
   * Fetches the {@link ExperienceControlsState.controls} property.
   *
   * @param request - The request to fetch the {@link ExperienceControlsState.controls}.
   * @returns A promise of the {@link ExperienceControlsState.controls}.
   */
  fetchControls(request: any): Promise<{ [key: string]: unknown }>;

  /**
   * Fetches and saves the {@link ExperienceControlsState.controls} property.
   */
  fetchAndSaveControls(request: any): void;
}

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
