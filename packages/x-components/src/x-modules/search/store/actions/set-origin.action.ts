import { SearchXStoreModule } from '../types';

/**
 * Default implementation for the {@link SearchActions.increasePageAppendingResults}.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 *
 * @public
 */
// eslint-disable-next-line max-len
export const setOrigin: SearchXStoreModule['actions']['setOrigin'] = (
  { state },
  payload,
  metadata
) => {
  debugger;
  console.log(state, metadata, payload);
};
