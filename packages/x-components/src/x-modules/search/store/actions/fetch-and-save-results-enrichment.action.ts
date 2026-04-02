import type { Result } from '@empathyco/x-types'

import type { SearchActionContext } from '../types'
import { DefaultResultsEnrichmentService } from '../../../../services/results-enrichment.service'
import { createFetchAndSaveActions } from '../../../../store/utils/fetch-and-save-action.utils'

const { fetchAndSave, cancelPrevious } = createFetchAndSaveActions<
  SearchActionContext,
  Result[],
  any[]
>({
  async fetch(_, results) {
    return results.length > 0 ? DefaultResultsEnrichmentService.instance.fetchResults(results) : []
  },
  onSuccess({ commit }, enrichmentResults) {
    commit('updateResultsFromEnrichment', enrichmentResults)
  },
})

/**
 * Default implementation for {@link SearchActions.fetchAndSaveResultsEnrichment}
 * action.
 *
 * @public
 */
export const fetchAndSaveResultsEnrichment = fetchAndSave

/**
 * Default implementation for {@link SearchActions.cancelFetchAndSaveResultsEnrichment}
 * action.
 *
 * @public
 */
export const cancelFetchAndSaveResultsEnrichment = cancelPrevious
