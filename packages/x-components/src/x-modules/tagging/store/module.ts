import { TaggingRequest } from '@empathyco/x-types';
import { mergeConfig, setConfig } from '../../../store/utils/config-store.utils';
import { track } from './actions/track.action';
import { TaggingXStoreModule } from './types';
import { updateQueryTaggingInfo } from './actions/update-query-tagging-info.action';
import { trackQueryWithResults } from './actions/index';

/**
 * {@link XStoreModule} For the tagging module.
 *
 * @internal
 */
export const taggingXStoreModule: TaggingXStoreModule = {
  state: () => ({
    config: {
      sessionTTLMs: 30 * 60 * 1000,
      queryTaggingDebounceMs: 2000,
      clickedResultStorageKey: null,
      clickedResultStorageTTLMs: null
    },
    consent: null,
    hasSemantics: false,
    queryTaggingInfo: null
  }),
  getters: {},
  mutations: {
    setConsent(state, consent) {
      state.consent = consent;
    },
    setQueryTaggingInfo(state, queryTaggingInfo: TaggingRequest) {
      state.queryTaggingInfo = queryTaggingInfo;
    },
    updateTotalHits(state, totalHits: string) {
      state.queryTaggingInfo!.params.totalHits = totalHits;
    },
    setHasSemantics(state, module) {
      if (module === 'semanticQueries') {
        state.hasSemantics = true;
      }
    },
    setConfig,
    mergeConfig
  },
  actions: {
    track,
    updateQueryTaggingInfo,
    trackQueryWithResults
  }
};
