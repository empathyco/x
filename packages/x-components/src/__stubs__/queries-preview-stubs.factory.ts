import type { SearchRequest } from '@empathyco/x-types'
import type { QueryPreviewItem } from '../x-modules/queries-preview/store/types'
import { getResultsStub } from './results-stubs.factory'

/**
 * Creates a {@link QueryPreviewItem} stub.
 *
 * @param query - The query to set in the request.
 * @param queryPreviewItem - The {@link QueryPreviewItem} data to overwrite the default stub.
 * @returns A {@link QueryPreviewItem}.
 *
 * @internal
 */
export const createQueryPreviewItem: (
  query: string,
  queryPreviewItem?: Partial<QueryPreviewItem>,
) => QueryPreviewItem = (query, queryPreviewItem) => {
  const results = getResultsStub()
  return {
    results,
    totalResults: results.length,
    instances: 1,
    status: 'success',
    request: getQueryPreviewRequest(query),
    ...queryPreviewItem,
  }
}

/**
 * Creates a queries preview search request stub.
 *
 * @param query - The query to set in the request.
 * @returns A {@link SearchRequest} to use with queries preview.
 *
 * @internal
 */
export function getQueryPreviewRequest(query: string): SearchRequest {
  return {
    query,
    rows: 3,
    extraParams: {
      extraParam: 'extra param',
    },
  }
}
