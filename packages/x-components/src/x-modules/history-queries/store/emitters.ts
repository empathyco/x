import { createStoreEmitters } from '../../../store';
import { historyQueriesXStoreModule } from './module';

/**
 * {@link StoreEmitters} For the history-queries module.
 *
 * @internal
 */
export const historyQueriesEmitters = createStoreEmitters(historyQueriesXStoreModule, {
  // Used for filtering next-queries with the session history queries
  SessionHistoryQueriesChanged: (_state, getters) => getters.sessionHistoryQueries,
  // Used for refreshing the session until it is extracted from the history queries module
  HistoryQueriesQueryChanged: { immediate: true, selector: state => state.query },
  // Used to load history-queries from the browser storage
  HistoryQueriesStorageKeyChanged: {
    immediate: true,
    selector: (_state, getters) => getters.storageKey
  }
});
