import type { TaggingRequest } from '@empathyco/x-types'
import type { TaggingXStoreModule } from './types'
import { mergeConfig, setConfig } from '../../../store/utils/config-store.utils'
import { track } from './actions/track.action'

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
      storageKey: null,
      storageTTLMs: null,
    },
    consent: null,
    noResultsTaggingEnabled: false,
    queryTaggingInfo: null,
    toolingTaggingInfo: {
      toolingDisplayClick: null,
      toolingDisplayAdd2Cart: null,
    },
  }),
  getters: {},
  mutations: {
    setConsent(state, consent) {
      state.consent = consent
    },
    setQueryTaggingInfo(state, queryTaggingInfo: TaggingRequest) {
      state.queryTaggingInfo = queryTaggingInfo
    },
    setNoResultsTaggingEnabled(state, module) {
      if (module === 'semanticQueries' || module === 'relatedPrompts') {
        state.noResultsTaggingEnabled = true
      }
    },
    setConfig,
    mergeConfig,
  },
  actions: {
    track,
  },
}
