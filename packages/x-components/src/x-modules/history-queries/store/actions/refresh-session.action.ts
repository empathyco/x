import { SESSION_TIME_STAMP_STORAGE_KEY, localStorageService } from '../constants';
import { HistoryQueriesXStoreModule } from '../types';

/**
 * Default implementation for the {@link HistoryQueriesActions.refreshSession}.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @public
 */
export const refreshSession: HistoryQueriesXStoreModule['actions']['refreshSession'] = ({
  state,
  commit
}) => {
  const sessionTimeStampInMs =
    localStorageService.getItem<number>(SESSION_TIME_STAMP_STORAGE_KEY) ?? Date.now();
  localStorageService.setItem(
    SESSION_TIME_STAMP_STORAGE_KEY,
    sessionTimeStampInMs,
    state.config.sessionTTLInMs
  );
  commit('setSessionTimeStamp', sessionTimeStampInMs);
};
