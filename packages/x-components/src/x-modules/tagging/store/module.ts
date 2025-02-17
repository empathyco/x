import { TaggingRequest } from '@empathyco/x-types';
import { mergeConfig, setConfig } from '../../../store/utils/config-store.utils';
import { track } from './actions/track.action';
import { TaggingXStoreModule } from './types';

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
    noResultsTaggingEnabled: false,
    queryTaggingInfo: null,
    toolingTaggingInfo: {
      toolingDisplayClick: null,
      toolingDisplayAdd2Cart: null
    }
  }),
  getters: {},
  mutations: {
    setConsent(state, consent) {
      state.consent = consent;
    },
    setQueryTaggingInfo(state, queryTaggingInfo: TaggingRequest) {
      state.queryTaggingInfo = queryTaggingInfo;
    },
    setNoResultsTaggingEnabled(state, module) {
      if (module === 'semanticQueries') {
        state.noResultsTaggingEnabled = true;
      }
    },
    setConfig,
    mergeConfig
  },
  actions: {
    track
  }
};
