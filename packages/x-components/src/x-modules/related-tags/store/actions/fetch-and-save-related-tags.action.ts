import { RelatedTag } from '@empathy/search-types';
import { ActionsClass } from '../../../../store';
import { cancellablePromise, CancelSymbol } from '../../../../utils/cancellable-promise';
import { noOp } from '../../../../utils/function';
import { RelatedTagsActionContext, RelatedTagsXStoreModule } from '../types';

/**
 * Class implementation for:
 * - {@link RelatedTagsActions.fetchAndSaveRelatedTags} action.
 * - {@link RelatedTagsActions.cancelFetchAndSaveRelatedTags} action.
 *
 * @public
 */
export class FetchAndSaveRelatedTagsAction implements ActionsClass<RelatedTagsXStoreModule> {
  protected cancelFetchAndSaveRelatedTagsFn: () => void = noOp;

  /**
   * Default implementation for the {@link RelatedTagsActions.fetchAndSaveRelatedTags}.
   *
   * Performs a dispatch in order to get suggestions. It also saves a pointer to the cancel
   * function got from cancellable promise function. That cancel function rejects the resultant
   * promise if it's called.
   *
   * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the
   * actions provided by Vuex.
   * @returns Promise.
   */
  fetchAndSaveRelatedTags({ dispatch, commit }: RelatedTagsActionContext): void | Promise<void> {
    const { promise, cancel } = cancellablePromise<RelatedTag[]>(dispatch('fetchRelatedTags'));
    this.cancelFetchAndSaveRelatedTagsFn = cancel;
    return promise
      .then(relatedTags => commit('setRelatedTags', relatedTags))
      .catch(err => {
        if (err !== CancelSymbol) {
          // TODO: Functionality is going to be implemented in EX-2663
        }
      });
  }

  /**
   * Default implementation for the {@link RelatedTagsActions.cancelFetchAndSaveRelatedTags}.
   *
   * Function that rejects the resultant promise, interrupting the synchronous promise flow.
   */
  cancelFetchAndSaveRelatedTags(): void {
    this.cancelFetchAndSaveRelatedTagsFn();
  }
}

const fetchAndSaveRelatedTagsAction = new FetchAndSaveRelatedTagsAction();

// eslint-disable-next-line jsdoc/require-description-complete-sentence
/**
 * {@inheritDoc FetchAndSaveRelatedTagsAction.fetchAndSaveRelatedTags}
 *
 * @public
 */
export const fetchAndSaveRelatedTags = fetchAndSaveRelatedTagsAction.fetchAndSaveRelatedTags.bind(
  fetchAndSaveRelatedTagsAction
);

// eslint-disable-next-line jsdoc/require-description-complete-sentence
/**
 * {@inheritDoc FetchAndSaveRelatedTagsAction.cancelFetchAndSaveRelatedTags}
 *
 * @public
 */
//eslint-disable-next-line max-len
export const cancelFetchAndSaveRelatedTags = fetchAndSaveRelatedTagsAction.cancelFetchAndSaveRelatedTags.bind(
  fetchAndSaveRelatedTagsAction
);
