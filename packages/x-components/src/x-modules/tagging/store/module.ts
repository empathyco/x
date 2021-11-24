import { track } from './actions/track-tagging.action';
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
      queryTaggingDebounceMs: 2000
    },
    consent: null
  }),
  getters: {},
  mutations: {
    setSessionDuration(state, sessionTTLMs) {
      state.config.sessionTTLMs = sessionTTLMs;
    },
    setQueryTaggingDebounce(state, queryTaggingDebounceMs) {
      state.config.queryTaggingDebounceMs = queryTaggingDebounceMs;
    },
    setConsent(state, consent) {
      state.consent = consent;
    }
  },
  actions: {
    track
  }
};
