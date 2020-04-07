import { HistoryQueriesXStoreModule } from '../types';

/**
 * Default implementation for the {@link HistoryQueriesGetters.storageKey} getter.
 *
 * @returns The key for retrieving and saving the history queries int the browser storage.
 * @public
 */
export const storageKey: HistoryQueriesXStoreModule['getters']['storageKey'] = () => {
  return 'HISTORY_QUERIES'; // TODO Use constant created in the actions PR
};
