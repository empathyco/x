import { Suggestion } from '@empathy/search-types';
import { ActionsClass } from '../../../../store';
import { cancellablePromise } from '../../../../utils/cancellable-promise';
import { QuerySuggestionsActionContext, QuerySuggestionsXStoreModule } from '../types';

/**
 * Class implementation for:
 * - {@link QuerySuggestionsActions.getAndSaveSuggestions} action.
 * - {@link QuerySuggestionsActions.cancelGetAndSaveSuggestions} action.
 *
 * @public
 */
class GetAndSaveSuggestionsAction implements ActionsClass<QuerySuggestionsXStoreModule> {
  protected cancelGetAndSaveSuggestionFn!: () => void;

  /**
   * Default implementation for the {@link QuerySuggestionsActions.getAndSaveSuggestions}.
   *
   * Performs a dispatch in order to get suggestions. It also saves a pointer to the cancel
   * function got from cancellable promise function. That cancel function rejects the resultant
   * promise if it's called.
   *
   * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the
   * actions provided by Vuex.
   * @returns Promise.
   */
  getAndSaveSuggestions({ dispatch, commit }: QuerySuggestionsActionContext): void | Promise<void> {
    const { promise, cancel } = cancellablePromise<Suggestion[]>(dispatch('getSuggestions'));
    this.cancelGetAndSaveSuggestionFn = cancel;
    return promise.then(suggestions => commit('setSuggestions', suggestions));
  }

  /**
   * Default implementation for the {@link QuerySuggestionsActions.cancelGetAndSaveSuggestions}.
   *
   * Function that rejects the resultant promise, interrupting the synchronous promise flow.
   */
  cancelGetAndSaveSuggestions(): void {
    this?.cancelGetAndSaveSuggestionFn();
  }
}

const getAndSaveSuggestionsAction = new GetAndSaveSuggestionsAction();

// eslint-disable-next-line jsdoc/require-description-complete-sentence
/**
 * {@inheritDoc GetAndSaveSuggestionsAction.getAndSaveSuggestions}
 *
 * @public
 */
export const getAndSaveSuggestions = getAndSaveSuggestionsAction.getAndSaveSuggestions.bind(
  getAndSaveSuggestionsAction
);

// eslint-disable-next-line jsdoc/require-description-complete-sentence
/**
 * {@inheritDoc GetAndSaveSuggestionsAction.cancelGetAndSaveSuggestions}
 *
 * @public
 */
//eslint-disable-next-line max-len
export const cancelGetAndSaveSuggestions = getAndSaveSuggestionsAction.cancelGetAndSaveSuggestions.bind(
  getAndSaveSuggestionsAction
);
