import { HISTORY_QUERIES_STORAGE_KEY } from '../constants';
import { HistoryQueriesXStoreModule } from '../types';

/**
 * Default implementation for the {@link HistoryQueriesGetters.storageKey} getter.
 *
 * @returns The key for retrieving and saving the history queries int the browser storage.
 * @public
 */
export const storageKey: HistoryQueriesXStoreModule['getters']['storageKey'] = () => {
  return HISTORY_QUERIES_STORAGE_KEY;
};
