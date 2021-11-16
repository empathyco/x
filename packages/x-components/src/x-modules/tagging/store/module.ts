import { TaggingXStoreModule } from './types';

/**
 * {@link XStoreModule} For the tagging module.
 *
 * @internal
 */
export const taggingXStoreModule: TaggingXStoreModule = {
  state: () => ({
    config: {
      sessionTTLInMs: 30 * 60 * 1000,
      queryTaggingDebounceMs: 200
    },
    consent: null
}),
  getters: {},
  mutations: {
    setConsent(state, consent) {
      state.consent = consent;
    }
  },
  actions: {}
};
