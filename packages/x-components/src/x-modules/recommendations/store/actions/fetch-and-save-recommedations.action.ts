import { Result } from '@empathy/search-types';
import { ActionsClass } from '../../../../store';
import { cancellablePromise, CancelSymbol } from '../../../../utils/cancellable-promise';
import { noOp } from '../../../../utils/function';
import { RecommendationsActionContext, RecommendationsXStoreModule } from '../types';

/**
 * Class implementation for:
 * - {@link RecommendationsActions.fetchAndSaveRecommendations} action.
 * - {@link RecommendationsActions.cancelFetchAndSaveRecommendations} action.
 *
 * @public
 */
export class FetchAndSaveRecommendationsAction
  implements ActionsClass<RecommendationsXStoreModule> {
  protected cancelFetchAndSaveRecommendationsFn: () => void = noOp;

  /**
   * Default implementation for the {@link RecommendationsActions.fetchAndSaveRecommendations}.
   *
   * Performs a dispatch in order to get suggestions. It also saves a pointer to the cancel
   * function got from cancellable promise function. That cancel function rejects the resultant
   * promise if it's called.
   *
   * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the
   * actions provided by Vuex.
   * @returns Promise.
   */
  fetchAndSaveRecommendations({
    dispatch,
    commit
  }: RecommendationsActionContext): void | Promise<void> {
    const { promise, cancel } = cancellablePromise<Result[]>(dispatch('fetchRecommendations'));
    this.cancelFetchAndSaveRecommendationsFn = cancel;
    return promise
      .then(recommendations => commit('setRecommendations', recommendations))
      .catch(err => {
        if (err !== CancelSymbol) {
          // TODO: Functionality is going to be implemented in EX-2663
        }
      });
  }

  /**
   * Default implementation for the
   * {@link RecommendationsActions.cancelFetchAndSaveRecommendations}.
   *
   * Function that rejects the resultant promise, interrupting the synchronous promise flow.
   */
  cancelFetchAndSaveRecommendations(): void {
    this.cancelFetchAndSaveRecommendationsFn();
  }
}

const fetchAndSaveRecommendationsAction = new FetchAndSaveRecommendationsAction();

// eslint-disable-next-line jsdoc/require-description-complete-sentence
/**
 * {@inheritDoc FetchAndSaveRecommendationsAction.fetchAndSaveRecommendations}
 *
 * @public
 */
//eslint-disable-next-line max-len
export const fetchAndSaveRecommendations = fetchAndSaveRecommendationsAction.fetchAndSaveRecommendations.bind(
  fetchAndSaveRecommendationsAction
);

// eslint-disable-next-line jsdoc/require-description-complete-sentence
/**
 * {@inheritDoc FetchAndSaveRecommendationsAction.cancelFetchAndSaveRecommendations}
 *
 * @public
 */
//eslint-disable-next-line max-len
export const cancelFetchAndSaveRecommendations = fetchAndSaveRecommendationsAction.cancelFetchAndSaveRecommendations.bind(
  fetchAndSaveRecommendationsAction
);
