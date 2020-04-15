import { HistoryQuery } from '@empathy/search-types';
import { ActionsClass } from '../../../../store/actions.types';
import { isArrayEmpty } from '../../../../utils/array';
import { normalizeString } from '../../../../utils/normalize';
import { Pair } from '../../../../utils/types';
import { HistoryQueriesActionContext, HistoryQueriesXStoreModule } from '../types';

/** Regex for splitting a query into its words. */
const SPLIT_WORDS_REGEX = /[\s-]/;

/**
 * Class implementation for the {@link HistoryQueriesActions.addQueryToHistory} action.
 *
 * @public
 */
export class AddQueryToHistoryAction implements ActionsClass<HistoryQueriesXStoreModule> {
  /**
   * Default implementation for the {@link HistoryQueriesActions.addQueryToHistory}.
   *
   * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the
   * actions, provided by Vuex.
   * @param query - The query to try to add to the history.
   * @returns A `void` promise that resolves when the history queries finishes updating.
   */
  addQueryToHistory(
    { state, dispatch }: HistoryQueriesActionContext,
    query: string
  ): void | Promise<void> {
    const normalizedQuery = normalizeString(query);
    if (!normalizedQuery) {
      return;
    }

    if (isArrayEmpty(state.historyQueries)) {
      return dispatch('setHistoryQueries', [this.createHistoryQuery(query)]);
    }

    const newHistory = this.createNewHistory(state.historyQueries, normalizedQuery);
    if (newHistory) {
      newHistory.unshift(this.createHistoryQuery(query));
      return dispatch('setHistoryQueries', newHistory);
    }
  }

  /**
   * Creates a new `HistoryQuery`.
   *
   * @param query - The query for the new `HistoryQuery`.
   * @returns A new `HistoryQuery`.
   * @internal
   */
  protected createHistoryQuery(query: string): HistoryQuery {
    return {
      query: query.trim(),
      timestamp: Date.now(),
      modelName: 'HistoryQuery'
    };
  }

  /**
   * Creates a new history from the old one to store the new query. Depending on the comparison
   * between the new query, and the last one in the history, it can return three different things:
   * - If it the last stored query should be replaced with the new one
   * ({@link AddQueryToHistoryAction.isReplaceAction} returns true), it returns a copy of the old
   * history, without the new query and the first item.
   * - If the new query should be simply added to the history
   * ({@link AddQueryToHistoryAction.isAddAction} returns true), It returns a copy of the old
   * history but without the new query if it was present.
   * - In any other case, the query shouldn't be saved, so this method returns `null`.
   *
   * @param currentHistory - The current history of queries.
   * @param normalizedQuery - The normalized version of the new query, to be stored on the history.
   * @returns A subset of the current history of queries ready to add the new `HistoryQuery`, or
   * null if the new query shouldn't be saved.
   * @internal
   */
  protected createNewHistory(
    currentHistory: HistoryQuery[],
    normalizedQuery: string
  ): HistoryQuery[] | null {
    const normalizedLastQuery = normalizeString(currentHistory[0].query);
    const queriesTuple: Pair<string> = [normalizedLastQuery, normalizedQuery];

    const newWords = normalizedQuery.split(SPLIT_WORDS_REGEX);
    const lastWords = normalizedLastQuery.split(SPLIT_WORDS_REGEX);
    const wordsTuple: Pair<string[]> = [lastWords, newWords];

    return this.isReplaceAction(wordsTuple, queriesTuple)
      ? // TODO EX-1815 This replace does not take into account yet queries that end in numbers
        this.removeNewQueryFromHistory(currentHistory.slice(1), normalizedQuery)
      : this.isAddAction(wordsTuple, queriesTuple)
      ? this.removeNewQueryFromHistory(currentHistory, normalizedQuery)
      : null;
  }

  /**
   * Creates a copy of the current history, but removing the new query to store from it. It uses a
   * normalized version of the queries for comparing.
   *
   * @param currentHistory - The current history queries.
   * @param normalizedQuery - The normalized version of the new query to add to the history.
   * @returns A copy of the current history but without the new query into it.
   * @internal
   */
  protected removeNewQueryFromHistory(
    currentHistory: HistoryQuery[],
    normalizedQuery: string
  ): HistoryQuery[] {
    return currentHistory.filter(
      historyQuery => normalizeString(historyQuery.query) !== normalizedQuery
    );
  }

  /**
   * Calculates if the new query should be added to the history.
   *
   * @param wordsTuple - A tuple containing the old, and the new words arrays.
   * @param queriesTuple - A tuple containing the old and the new queries.
   * @returns `true` when the new query should be added. `false` otherwise.
   * @internal
   */
  protected isAddAction(
    [lastWords, newWords]: Pair<string[]>,
    [lastQuery, newQuery]: Pair<string>
  ): boolean {
    return newWords.length !== lastWords.length || !lastQuery.includes(newQuery);
  }

  /**
   * Calculates if the new query should replace the last query in the history.
   *
   * @param wordsTuple - A tuple containing the old, and the new words arrays.
   * @param queriesTuple - A tuple containing the old and the new queries.
   * @returns `true` when the new query should replace the last one. `false` otherwise.
   * @internal
   */
  protected isReplaceAction(
    [lastWords, newWords]: Pair<string[]>,
    [lastQuery, newQuery]: Pair<string>
  ): boolean {
    return lastQuery === newQuery || this.isLastWordRefined(lastWords, newWords);
  }

  /**
   * Returns if the new query is a refined version of the last one. A refined version means to be
   * more specific. I.e. `shoes` is a refined query of `shoe`.
   *
   * @param lastWords - An array containing the words of the last query.
   * @param newWords - An array containing the words of the new query.
   * @returns `true` if the new query is refining the old one. `false` otherwhise.
   * @internal
   */
  protected isLastWordRefined(lastWords: string[], newWords: string[]): boolean {
    const differentWordIndex = newWords.findIndex((newWord, index) => newWord !== lastWords[index]);
    return (
      newWords.length === lastWords.length &&
      differentWordIndex === lastWords.length - 1 &&
      newWords[differentWordIndex].includes(lastWords[differentWordIndex])
    );
  }
}

const addQueryToHistoryAction = new AddQueryToHistoryAction();

// eslint-disable-next-line jsdoc/require-description-complete-sentence
/**
 * {@inheritDoc AddQueryToHistoryAction.addQueryToHistory}
 *
 * @public
 */
export const addQueryToHistory = addQueryToHistoryAction.addQueryToHistory.bind(
  addQueryToHistoryAction
);
