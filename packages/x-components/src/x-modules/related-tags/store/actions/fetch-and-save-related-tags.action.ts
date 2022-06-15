import { RelatedTag, RelatedTagsRequest } from '@empathyco/x-types';
// eslint-disable-next-line max-len
import { createFetchAndSaveActions } from '../../../../store/utils/fetch-and-save-action.utils';
import { RelatedTagsActionContext } from '../types';

const { fetchAndSave, cancelPrevious } = createFetchAndSaveActions<
  RelatedTagsActionContext,
  RelatedTagsRequest | null,
  RelatedTag[]
>({
  fetch({ dispatch }, request) {
    return dispatch('fetchRelatedTags', request);
  },
  onSuccess({ commit }, relatedTags) {
    commit('setRelatedTags', relatedTags);
  }
});

/**
 * Default implementation for {@link RelatedTagsActions.fetchAndSaveRelatedTags} action.
 *
 * @public
 */
export const fetchAndSaveRelatedTags = fetchAndSave;

/**
 * Default implementation for {@link RelatedTagsActions.fetchAndSaveRelatedTags} action.
 *
 * @public
 */
export const cancelFetchAndSaveRelatedTags = cancelPrevious;
