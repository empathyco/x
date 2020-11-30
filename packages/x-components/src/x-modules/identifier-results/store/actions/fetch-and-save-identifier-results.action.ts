import { Result } from '@empathy/search-types';
import { ActionsClass } from '../../../../store/actions.types';
import { cancellablePromise, CancelSymbol } from '../../../../utils/cancellable-promise';
import { noOp } from '../../../../utils/function';
import { IdentifierResultsActionsContext, IdentifierResultsXStoreModule } from '../types';

/**
 * Class implementation for:
 * - {@link IdentifierResultsActions.fetchAndSaveIdentifierResults} action.
 * - {@link IdentifierResultsActions.cancelFetchAndSaveIdentifierResults} action.
 *
 * @public
 */
export class FetchAndSaveIdentifierResultsAction
  implements ActionsClass<IdentifierResultsXStoreModule> {
  protected cancelFetchAndSaveIdentifierResultsFn: () => void = noOp;

  /**
   * Default implementation for the {@link IdentifierResultsActions.fetchAndSaveIdentifierResults}.
   *
   * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the
   * actions provided by Vuex.
   * @returns A `void` promise that resolves when the identifier results finishes updating.
   */
  fetchAndSaveIdentifierResults({
    dispatch,
    commit
  }: IdentifierResultsActionsContext): void | Promise<void> {
    const { promise, cancel } = cancellablePromise<Result[]>(dispatch('fetchIdentifierResults'));
    this.cancelFetchAndSaveIdentifierResultsFn = cancel;
    return promise
      .then(identifierResults => commit('setIdentifierResults', identifierResults))
      .catch(err => {
        if (err !== CancelSymbol) {
          // TODO: Functionality is going to be implemented in EX-2663
        }
      });
  }

  /**
   * Default implementation for the
   * {@link IdentifierResultsActions.cancelFetchAndSaveIdentifierResults}.
   *
   * Function that rejects the resultant promise, interrupting the synchronous promise flow.
   */
  cancelFetchAndSaveIdentifierResults(): void {
    this.cancelFetchAndSaveIdentifierResultsFn();
  }
}

const fetchAndSaveIdentifierResultsAction = new FetchAndSaveIdentifierResultsAction();

// eslint-disable-next-line jsdoc/require-description-complete-sentence
/**
 * {@inheritDoc FetchAndSaveIdentifierResultsAction.fetchAndSaveIdentifierResults}
 *
 * @public
 */
//eslint-disable-next-line max-len
export const fetchAndSaveIdentifierResults = fetchAndSaveIdentifierResultsAction.fetchAndSaveIdentifierResults.bind(
  fetchAndSaveIdentifierResultsAction
);

// eslint-disable-next-line jsdoc/require-description-complete-sentence
/**
 * {@inheritDoc FetchAndSaveIdentifierResultsAction.cancelFetchAndSaveIdentifierResults}
 *
 * @public
 */
//eslint-disable-next-line max-len
export const cancelFetchAndSaveIdentifierResults = fetchAndSaveIdentifierResultsAction.cancelFetchAndSaveIdentifierResults.bind(
  fetchAndSaveIdentifierResultsAction
);
