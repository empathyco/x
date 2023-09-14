import { createFetchAndSaveActions } from '../../../../store/utils/fetch-and-save-action.utils';
import { ExperienceControlsActionContext } from '../types';

const { fetchAndSave, cancelPrevious } = createFetchAndSaveActions<
  ExperienceControlsActionContext,
  any,
  any
>({
  fetch({ dispatch }, request) {
    return dispatch('fetchControls', request);
  },
  onSuccess({ commit }, controls) {
    commit('setControls', controls);
  }
});

/**
 * Default implementation for {@link ExperienceControlsActions.fetchAndSaveControls} action.
 *
 * @public
 */
export const fetchAndSaveControls = fetchAndSave;

/**
 * Default implementation for {@link ExperienceControlsActions.cancelFetchAndSaveControls} action.
 *
 * @public
 */
export const cancelFetchAndSaveControls = cancelPrevious;
