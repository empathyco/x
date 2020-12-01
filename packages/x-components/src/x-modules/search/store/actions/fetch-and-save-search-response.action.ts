import { SearchResponse } from '@empathy/search-adapter';
import { ActionsClass } from '../../../../store';
import { cancellablePromise, CancelSymbol } from '../../../../utils/cancellable-promise';
import { noOp } from '../../../../utils/function';
import { SearchActionContext, SearchXStoreModule } from '../types';

/**
 * Class implementation for:
 * - {@link SearchActions.fetchAndSaveSearchResponse} action.
 * - {@link SearchActions.cancelFetchAndSaveSearchResponse} action.
 *
 * @public
 */
export class FetchAndSaveSearchResponseAction implements ActionsClass<SearchXStoreModule> {
  protected cancelFetchAndSaveSearchResponseFn: () => void = noOp;

  /**
   * Default implementation for the {@link SearchActions.fetchAndSaveSearchResponse}.
   *
   * Performs a dispatch in order to get suggestions. It also saves a pointer to the cancel
   * function got from cancellable promise function. That cancel function rejects the resultant
   * promise if it's called.
   *
   * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the
   * actions provided by Vuex.
   * @returns Promise.
   */
  fetchAndSaveSearchResponse({ dispatch, commit }: SearchActionContext): void | Promise<void> {
    const { promise, cancel } = cancellablePromise<SearchResponse>(dispatch('fetchSearchResponse'));
    this.cancelFetchAndSaveSearchResponseFn = cancel;
    commit('setStatus', 'loading');
    return promise
      .then(({ results, facets }) => {
        commit('setResults', results);
        commit('setFacets', facets);
        commit('setStatus', 'success');
      })
      .catch(err => {
        if (err !== CancelSymbol) {
          // TODO: Functionality is going to be implemented in EX-2663
        }
      });
  }

  /**
   * Default implementation for the {@link SearchActions.cancelFetchAndSaveSearchResponse}.
   *
   * Function that rejects the resultant promise, interrupting the synchronous promise flow.
   */
  cancelFetchAndSaveSearchResponse(): void {
    this.cancelFetchAndSaveSearchResponseFn();
  }
}

const fetchAndSaveSearchResponseAction = new FetchAndSaveSearchResponseAction();

// eslint-disable-next-line jsdoc/require-description-complete-sentence
/**
 * {@inheritDoc FetchAndSaveSearchResponseAction.fetchAndSaveSearchResponse}
 *
 * @public
 */
//eslint-disable-next-line max-len
export const fetchAndSaveSearchResponse = fetchAndSaveSearchResponseAction.fetchAndSaveSearchResponse.bind(
  fetchAndSaveSearchResponseAction
);

// eslint-disable-next-line jsdoc/require-description-complete-sentence
/**
 * {@inheritDoc FetchAndSaveSearchResponseAction.cancelFetchAndSaveSearchResponse}
 *
 * @public
 */
//eslint-disable-next-line max-len
export const cancelFetchAndSaveSearchResponse = fetchAndSaveSearchResponseAction.cancelFetchAndSaveSearchResponse.bind(
  fetchAndSaveSearchResponseAction
);
