import type { QueriesPreviewXStoreModule } from './types'
import { DefaultResultsEnrichmentService } from '../../../services/results-enrichment.service'
import { mergeConfig, setConfig } from '../../../store/utils/config-store.utils'
import { getHashFromQueryPreviewItem } from '../utils/get-hash-from-query-preview'
import { fetchAndSaveQueryPreviewResultsEnrichment } from './actions/fetch-and-save-query-preview-results-enrichment.action'
import { fetchAndSaveQueryPreview } from './actions/fetch-and-save-query-preview.action'
import { fetchQueryPreview } from './actions/fetch-query-preview.action'
import { loadedQueriesPreview } from './getters/loaded-queries-preview.getter'

/**
 * {@link XStoreModule} For the `queries-preview` module.
 *
 * @internal
 */
export const queriesPreviewXStoreModule: QueriesPreviewXStoreModule = {
  state: () => ({
    config: {
      maxItemsToRequest: 24,
    },
    queriesPreview: {},
    selectedQueryPreview: {
      query: '',
      extraParams: undefined,
      filters: undefined,
    },
    params: {},
  }),
  getters: { loadedQueriesPreview },
  mutations: {
    clearQueryPreview(state, queryPreviewHash) {
      delete state.queriesPreview[queryPreviewHash]
    },
    setParams(state, params) {
      state.params = params
    },
    setQueryPreviewCached(state, queryPreview) {
      state.queriesPreview[getHashFromQueryPreviewItem(queryPreview)] = queryPreview
    },
    setStatus(state, { queryPreviewHash, status }) {
      state.queriesPreview[queryPreviewHash].status = status
    },
    setSelectedQueryPreview(state, selectedQueryPreview) {
      state.selectedQueryPreview = selectedQueryPreview
    },
    setConfig,
    mergeConfig,
    addQueryPreviewInstance(state, queryPreviewHash) {
      if (state.queriesPreview[queryPreviewHash]) {
        state.queriesPreview[queryPreviewHash].instances += 1
      }
    },
    removeQueryPreviewInstance(state, { queryPreviewHash, cache }) {
      if (state.queriesPreview[queryPreviewHash]) {
        state.queriesPreview[queryPreviewHash].instances -= 1

        if (!cache && state.queriesPreview[queryPreviewHash].instances === 0) {
          delete state.queriesPreview[queryPreviewHash]
        }
      }
    },
    updateAQueryPreviewResult(state, { result, queryPreviewHash }) {
      const queryPreviewResult = state.queriesPreview[queryPreviewHash]?.results.find(
        resultPreview => resultPreview.id === result.id,
      )
      if (queryPreviewResult) {
        Object.assign(queryPreviewResult, result)
      }
    },
    updateQueryPreviewResultsFromEnrichment(state, { queryPreviewItem, enrichmentResults }) {
      const queryPreview = state.queriesPreview[getHashFromQueryPreviewItem(queryPreviewItem)]
      if (queryPreview) {
        DefaultResultsEnrichmentService.instance.updateResults(
          queryPreview.results,
          enrichmentResults,
        )
      }
    },
  },
  actions: {
    fetchQueryPreview,
    fetchAndSaveQueryPreview,
    fetchAndSaveQueryPreviewResultsEnrichment,
  },
}
