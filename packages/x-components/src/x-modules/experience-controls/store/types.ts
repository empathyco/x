import { Dictionary } from '@empathyco/x-utils';
import { ExperienceControlsRequest, ExperienceControlsResponse } from '@empathyco/x-types';
import { XEventsTypes } from '../../../wiring';
import { XStoreModule } from '../../../store/store.types';
import { StatusMutations, StatusState, XActionContext } from '../../../store';

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
  params: Dictionary<unknown>;
}

/**
 * Experience Controls store getters.
 *
 * @public
 */
export interface ExperienceControlsGetters {
  /**
   * The adapter request object for retrieving the controls request, or null if there is not
   * valid data to create a request.
   */
  experienceControlsRequest: ExperienceControlsRequest | null;
}

/**
 * Experience Controls store mutations.
 *
 * @public
 */
export interface ExperienceControlsMutations extends StatusMutations {
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

  /**
   * Sets the extra params of the module.
   *
   * @param params - The new extra params.
   */
  setParams(params: Dictionary<unknown>): void;
}

/**
 * Experience Controls store actions.
 *
 * @public
 */
export interface ExperienceControlsActions {
  /**.
   * Requests the experience controls
   *
   *
   * @param request - The request to fetch the experience controls.
   * @returns the experience controls.
   */
  fetchExperienceControlsResponse(
    request: ExperienceControlsRequest | null
  ): ExperienceControlsResponse;

  /**
   * Requests the experience controls and saves them in the module.
   *
   * @param request - The request to fetch the experience controls.
   */
  fetchAndSaveExperienceControlsResponse(request: ExperienceControlsRequest | null): void;

  /**
   * Cancels the {@link ExperienceControlsActions.  fetchAndSaveExperienceControlsResponse}.
   */
  cancelFetchAndSaveControls: () => void;
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
