import { TaggingXStoreModule } from '../types';

/**
 * Default implementation for the {@link TaggingActions.updateQueryTaggingInfo}.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @param tagging - The information of the event to track.
 *
 * @public
 */
export const updateQueryTaggingInfo: TaggingXStoreModule['actions']['updateQueryTaggingInfo'] = (
  { commit, state, dispatch },
  tagging
) => {
  commit('updateTotalHits', tagging.totalHits);
  dispatch('track', state.queryTaggingInfo!);
};
