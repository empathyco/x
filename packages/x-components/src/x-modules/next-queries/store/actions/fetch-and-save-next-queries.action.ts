import { NextQuery } from '@empathy/search-types';
import { ActionsClass } from '../../../../store';
import { cancellablePromise, CancelSymbol } from '../../../../utils/cancellable-promise';
import { noOp } from '../../../../utils/function';
import { NextQueriesActionContext, NextQueriesXStoreModule } from '../types';

/**
 * Class implementation for:
 * - {@link NextQueriesActions.fetchAndSaveNextQueries} action.
 * - {@link NextQueriesActions.cancelFetchAndSaveNextQueries} action.
 *
 * @public
 */
export class FetchAndSaveNextQueriesAction implements ActionsClass<NextQueriesXStoreModule> {
  protected cancelFetchAndSaveNextQueriesFn: () => void = noOp;

  /**
   * Default implementation for the {@link NextQueriesActions.fetchAndSaveNextQueries}.
   *
   * Performs a dispatch in order to get suggestions. It also saves a pointer to the cancel
   * function got from cancellable promise function. That cancel function rejects the resultant
   * promise if it's called.
   *
   * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the
   * actions provided by Vuex.
   * @returns A `void` promise that resolves when the next queries finishes updating.
   *
   * @public
   */
  fetchAndSaveNextQueries({ dispatch, commit }: NextQueriesActionContext): void | Promise<void> {
    const { promise, cancel } = cancellablePromise<NextQuery[] | null>(
      dispatch('fetchNextQueries')
    );
    this.cancelFetchAndSaveNextQueriesFn = cancel;
    return promise
      .then(nextQueries => {
        if (nextQueries != null) {
          commit('setNextQueries', nextQueries);
        }
      })
      .catch(err => {
        if (err !== CancelSymbol) {
          // TODO: Functionality is going to be implemented in EX-2663
        }
      });
  }

  /**
   * Default implementation for the {@link NextQueriesActions.cancelFetchAndSaveNextQueries}.
   *
   * Function that rejects the resultant promise, interrupting the synchronous promise flow.
   */
  cancelFetchAndSaveNextQueries(): void {
    this.cancelFetchAndSaveNextQueriesFn();
  }
}

const fetchAndSaveNextQueriesAction = new FetchAndSaveNextQueriesAction();

// eslint-disable-next-line jsdoc/require-description-complete-sentence
/**
 * {@inheritDoc FetchAndSaveNextQueriesAction.fetchAndSaveNextQueries}
 *
 * @public
 */
export const fetchAndSaveNextQueries = fetchAndSaveNextQueriesAction.fetchAndSaveNextQueries.bind(
  fetchAndSaveNextQueriesAction
);

// eslint-disable-next-line jsdoc/require-description-complete-sentence
/**
 * {@inheritDoc FetchAndSaveNextQueriesAction.cancelFetchAndSaveNextQueries}
 *
 * @public
 */
//eslint-disable-next-line max-len
export const cancelFetchAndSaveNextQueries = fetchAndSaveNextQueriesAction.cancelFetchAndSaveNextQueries.bind(
  fetchAndSaveNextQueriesAction
);
