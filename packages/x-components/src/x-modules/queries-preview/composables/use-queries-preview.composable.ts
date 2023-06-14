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
  /**
   * Checks if the query passed has results in the queries preview.
   *
   * @param query - The query to check.
   * @returns True if the query has results.
   */
  isQueryLoadedInPreview: (query: string) => boolean;
}

/**
 * Composable helpers for the QueriesPreview module.
 *
 * @returns Composable with helpers.
 */
export const useQueriesPreview = (): UseQueriesPreview => {
  const store = XPlugin.store;
  const loadedQueriesPreview = computed<QueriesPreviewGetters['loadedQueriesPreview']>(
    () => store.getters['x/queriesPreview/loadedQueriesPreview']
  );
  const loadedQueries = computed(() => {
    return Object.keys(loadedQueriesPreview.value);
  });

  /**
   * Checks if the query passed has results in the queries preview.
   *
   * @param query - The query to check.
   * @returns True if the query has results.
   */
  const isQueryLoadedInPreview: UseQueriesPreview['isQueryLoadedInPreview'] = (
    query: string
  ): boolean => {
    return loadedQueries.value.includes(query);
  };

  /**
   * Checks if any of the queries passed have results in the queries previews.
   *
   * @param queries - The queries to check.
   * @returns True if some query has results.
   */
  const isAnyQueryLoadedInPreview: UseQueriesPreview['isAnyQueryLoadedInPreview'] = (
    queries: string[]
  ): boolean => {
    return queries.some(isQueryLoadedInPreview);
  };

  return {
    isAnyQueryLoadedInPreview,
    isQueryLoadedInPreview
  };
};
