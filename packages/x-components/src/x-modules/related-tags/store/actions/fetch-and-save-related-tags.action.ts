import type { RelatedTag, RelatedTagsRequest } from '@empathyco/x-types'

import type { RelatedTagsActionContext } from '../types'
import { createFetchAndSaveActions } from '../../../../store/utils/fetch-and-save-action.utils'

const { fetchAndSave, cancelPrevious } = createFetchAndSaveActions<
  RelatedTagsActionContext,
  RelatedTagsRequest | null,
  RelatedTag[]
>({
  async fetch({ dispatch }, request) {
    return dispatch('fetchRelatedTags', request)
  },
  onSuccess({ commit }, relatedTags) {
    commit('setRelatedTags', relatedTags)
  },
})

/**
 * Default implementation for {@link RelatedTagsActions.fetchAndSaveRelatedTags} action.
 *
 * @public
 */
export const fetchAndSaveRelatedTags = fetchAndSave

/**
 * Default implementation for {@link RelatedTagsActions.fetchAndSaveRelatedTags} action.
 *
 * @public
 */
export const cancelFetchAndSaveRelatedTags = cancelPrevious
