import { Dictionary } from '@empathyco/x-utils';
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
  controls: Dictionary<unknown>;
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
   * @param controls - The new {@link ExperienceControlsState.controls}.
   */
  setControls(controls: Dictionary<unknown>): void;

  /**
   * Sets the {@link ExperienceControlsState.events} property.
   *
   * @param events - The new {@link ExperienceControlsState.events}.
   */
  setEvents(events: Partial<XEventsTypes>): void;
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
