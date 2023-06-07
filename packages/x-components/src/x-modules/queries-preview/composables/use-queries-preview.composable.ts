import { computed } from 'vue';
import { QueriesPreviewGetters } from '../store';
import { XPlugin } from '../../../plugins/x-plugin';

/**
 * Composable helpers for the QueriesPreview module.
 */
interface UseQueriesPreview {
  /**
   * Checks if any of the queries passed have results in the queries previews.
   *
   * @param queries - The queries to check.
   * @returns True if some query has results.
   */
  isAnyQueryLoadedInPreview: (queries: string[]) => boolean;
}

/**
 * Checks if any of the queries passed have results in the queries previews.
 *
 * @param queries - The queries to check.
 * @returns True if some query has results.
 */
export const isAnyQueryLoadedInPreview: UseQueriesPreview['isAnyQueryLoadedInPreview'] = (
  queries: string[]
): boolean => {
  const store = XPlugin.store;
  const loadedQueriesPreview = computed<QueriesPreviewGetters['loadedQueriesPreview']>(
    () => store.getters['x/queriesPreview/loadedQueriesPreview']
  );
  const loadedQueries = Object.keys(loadedQueriesPreview.value);
  return queries.some(query => loadedQueries.includes(query));
};

/**
 * Composable helpers for the QueriesPreview module.
 *
 * @returns Composable with helpers.
 */
export const useQueriesPreview = (): UseQueriesPreview => {
  return {
    isAnyQueryLoadedInPreview
  };
};
