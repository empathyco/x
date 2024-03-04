import { TaggingXStoreModule } from '../types';

/**
 * Default implementation for the {@link TaggingActions.trackQueryWithResults}.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @param taggingInfo - The information of the event to track.
 *
 * @public
 */
export const trackQueryWithResults: TaggingXStoreModule['actions']['trackQueryWithResults'] = (
  { state, dispatch },
  taggingInfo
) => {
  if (state.queryTaggingInfo!.params.totalHits > 0 || !state.hasSemantics) {
    dispatch('track', taggingInfo);
  }
};
