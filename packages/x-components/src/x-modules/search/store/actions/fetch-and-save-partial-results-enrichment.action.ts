import type { PartialResult } from '@empathyco/x-types'

import type { SearchActionContext } from '../types'
import { DefaultExternalResultEnrichmentService } from '@x/services/external-result-enrichment.service'
import { createFetchAndSaveActions } from '../../../../store/utils/fetch-and-save-action.utils'

const { fetchAndSave, cancelPrevious } = createFetchAndSaveActions<
  SearchActionContext,
  PartialResult[],
  any[]
>({
  async fetch(_, partialResults) {
    const results = partialResults.flatMap(partialResult => partialResult.results ?? [])
    const resultSet = new Set()
    const uniqueResults = results.filter(result =>
      resultSet.has(result.id) ? false : resultSet.add(result.id),
    )
    return uniqueResults.length > 0
      ? DefaultExternalResultEnrichmentService.instance.fetchExternalResults(uniqueResults)
      : []
  },
  onSuccess({ commit }, externalResults) {
    commit('updatePartialResultsFromEnrichment', externalResults)
  },
})

/**
 * Default implementation for {@link SearchActions.fetchAndSavePartialResultsEnrichment}
 * action.
 *
 * @public
 */
export const fetchAndSavePartialResultsEnrichment = fetchAndSave

/**
 * Default implementation for {@link SearchActions.cancelFetchAndSavePartialResultsEnrichment}
 * action.
 *
 * @public
 */
export const cancelFetchAndSavePartialResultsEnrichment = cancelPrevious
