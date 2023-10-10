import { ExperienceControlsRequest, ExperienceControlsResponse } from '@empathyco/x-types';
import { createFetchAndSaveActions } from '../../../../store/utils/fetch-and-save-action.utils';
import { ExperienceControlsActionContext } from '../types';

const { fetchAndSave, cancelPrevious } = createFetchAndSaveActions<
  ExperienceControlsActionContext,
  ExperienceControlsRequest | null,
  ExperienceControlsResponse
>({
  fetch({ dispatch }, request) {
    return dispatch('fetchExperienceControlsResponse', request);
  },
  onSuccess({ commit }, experienceControlsResponse) {
    commit('setControls', experienceControlsResponse.controls);
    commit('setEvents', experienceControlsResponse.events);
  }
});

/**
 * Default implementation for fetchAndSaveExperienceControls action.
 *
 * @public
 */
export const fetchAndSaveExperienceControlsResponse = fetchAndSave;

/**
 * Default implementation for fetchAndSaveExperienceControls action.
 *
 * @public
 */
export const cancelFetchAndSaveControls = cancelPrevious;
