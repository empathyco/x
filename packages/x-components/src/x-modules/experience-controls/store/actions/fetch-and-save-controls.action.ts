import { createFetchAndSaveActions } from '../../../../store/utils/fetch-and-save-action.utils';
import { ExperienceControlsActionContext } from '../types';

const { fetchAndSave, cancelPrevious } = createFetchAndSaveActions<
  ExperienceControlsActionContext,
  //TODO: change types when the adapter is updated
  any,
  any
>({
  fetch({ dispatch }, request) {
    return dispatch('fetchExperienceControlsResponse', request);
  },
  onSuccess({ commit }, controls) {
    commit('setControls', controls);
    commit('setEvents', {});
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
