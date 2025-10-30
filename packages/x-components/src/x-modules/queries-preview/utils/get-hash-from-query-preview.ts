import type { Dictionary } from '@empathyco/x-utils'
import type { QueryPreviewInfo, QueryPreviewItem } from '../store/index'
import { md5 } from 'js-md5'

/**
 * Creates a query hash to store a QueryPreview, so the same query
 * with different filters and extra params can be saved more than once in the state.
 *
 * @param queryPreview - The {@link QueryPreviewItem | QueryPreviewItem} used in the request.
 * @returns A unique id that will be used as a key to store the QueryPreviewItem in the state.
 */
export const getHashFromQueryPreviewItem = (queryPreview: QueryPreviewItem): string => {
  const queryPreviewFilters = queryPreview.request.filters
    ? Object.values(queryPreview.request.filters)
        .flat()
        .map(filter => filter.id.toString())
        .join('-')
    : ''

  const queriesPreviewExtraParams = getJoinedParams(queryPreview.request.extraParams)

  return md5(
    queryPreview.request.query.concat(queryPreviewFilters).concat(queriesPreviewExtraParams),
  )
}

/**
 * Creates a query hash to check if a QueryPreview has already been saved in the state.
 *
 * @param queryPreviewInfo - The {@link QueryPreviewInfo | QueryPreviewInfo} of a QueryPreview.
 * @param extraParams - The extra params used in the request.
 * @returns A unique id that will be used as a key to check the QueryPreview in the state.
 */
export const getHashFromQueryPreviewInfo = (
  queryPreviewInfo: QueryPreviewInfo,
  extraParams: Dictionary<unknown>,
): string => {
  const queryPreviewFilters = queryPreviewInfo.filters ? queryPreviewInfo.filters.join('-') : ''
  const queriesPreviewExtraParams = getJoinedParams(extraParams)

  return md5(queryPreviewInfo.query.concat(queryPreviewFilters).concat(queriesPreviewExtraParams))
}

function getJoinedParams(params?: Record<string, unknown>): string {
  return params
    ? Object.values(params)
        .flat()
        .map(param => param?.toString() ?? '')
        .join('-')
    : ''
}
