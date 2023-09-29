import { ExperienceControlsRequest, ExperienceControlsResponse } from '@empathyco/x-types';
import { Dictionary } from '@empathyco/x-utils';
import { createFetchAndSaveActions } from '../../../../store/utils/fetch-and-save-action.utils';
import { ExperienceControlsActionContext } from '../types';

const { fetchAndSave, cancelPrevious } = createFetchAndSaveActions<
  ExperienceControlsActionContext,
  ExperienceControlsRequest,
  ExperienceControlsResponse | Dictionary<any>
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
 * Default implementation for {@link ExperienceControlsActions.fetchAndSaveControls} action.
 *
 * @public
 */
export const fetchAndSaveExperienceControlsResponse = fetchAndSave;

/**
 * Default implementation for {@link ExperienceControlsActions.cancelFetchAndSaveControls} action.
 *
 * @public
 */
export const cancelFetchAndSaveControls = cancelPrevious;
