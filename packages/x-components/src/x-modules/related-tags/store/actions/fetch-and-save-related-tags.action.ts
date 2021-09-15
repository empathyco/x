import { RelatedTag } from '@empathyco/x-types';
// eslint-disable-next-line max-len
import { createFetchAndSaveAction } from '../../../../store/fetch-and-save-action.helpers';
import { RelatedTagsActionContext } from '../types';

const { fetchAndSave, cancelPrevious } = createFetchAndSaveAction<
  RelatedTagsActionContext,
  RelatedTag[]
>({
  fetch({ dispatch }) {
    return dispatch('fetchRelatedTags');
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
