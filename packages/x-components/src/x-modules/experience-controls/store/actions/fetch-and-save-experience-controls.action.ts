import type { ExperienceControlsRequest, ExperienceControlsResponse } from '@empathyco/x-types'
import type { ExperienceControlsActionContext } from '../types'
import { createFetchAndSaveActions } from '../../../../store/utils/fetch-and-save-action.utils'

const { fetchAndSave, cancelPrevious } = createFetchAndSaveActions<
  ExperienceControlsActionContext,
  ExperienceControlsRequest | null,
  ExperienceControlsResponse
>({
  async fetch({ dispatch }, request) {
    return dispatch('fetchExperienceControlsResponse', request)
  },
  onSuccess({ commit }, experienceControlsResponse) {
    commit('setControls', experienceControlsResponse.controls)
    commit('setEvents', experienceControlsResponse.events)
  },
})

/**
 * Default implementation for fetchAndSaveExperienceControls action.
 *
 * @public
 */
export const fetchAndSaveExperienceControlsResponse = fetchAndSave

/**
 * Default implementation for fetchAndSaveExperienceControls action.
 *
 * @public
 */
export const cancelFetchAndSaveControls = cancelPrevious
