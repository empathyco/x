import type { QueriesPreviewXStoreModule } from '../types'
import { DefaultResultsEnrichmentService } from '../../../../services/results-enrichment.service'

export const fetchAndSaveQueryPreviewResultsEnrichment: QueriesPreviewXStoreModule['actions']['fetchAndSaveQueryPreviewResultsEnrichment'] =
  async ({ commit }, queryPreviewItem) => {
    if (!queryPreviewItem || !queryPreviewItem.results) {
      return
    }

    DefaultResultsEnrichmentService.instance
      .fetchResults(queryPreviewItem.results)
      .then(enrichmentResults => {
        commit('updateQueryPreviewResultsFromEnrichment', {
          queryPreviewItem,
          enrichmentResults,
        })
      })
      .catch(error => {
        console.error(error)
      })
  }
