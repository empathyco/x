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
  const queryPreviewFilters = getJoinedParams(queryPreview.request.filters)
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

/**
 * Joins the values of the given parameters object into a single string, separated by hyphens.
 *
 * - If `params` is provided, its values are flattened (if they are arrays), converted to strings,
 *   and concatenated with hyphens (`-`) as separators.
 * - If `params` is not provided, returns an empty string.
 * - If a value has an `id` property (like Filter objects), the `id` is used instead of the whole object.
 *
 * @param params - An optional object whose values will be joined into a string.
 * @returns A string containing the joined parameter values, or an empty string if no parameters are provided.
 */
function getJoinedParams(params?: Record<string, unknown>): string {
  return params
    ? Object.values(params)
        .flat()
        .map(param => {
          if (param && typeof param === 'object' && 'id' in param) {
            return (param as { id: unknown }).id?.toString() ?? ''
          }
          return param?.toString() ?? ''
        })
        .join('-')
    : ''
}
