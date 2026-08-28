import type { QuerySuggestionsResponse } from '@empathyco/x-types'
import type { PlatformQuerySuggestionsResponse } from '../../types/responses/query-suggestions-response.model'
import { querySuggestionsResponseSchema } from '../../schemas/responses/query-suggestions-response.schema'

/**
 * Default implementation for the QuerySuggestionsResponseMapper.
 *
 * @public
 */
export const querySuggestionsResponseMapper = querySuggestionsResponseSchema as (
  source: PlatformQuerySuggestionsResponse,
  context: Record<string, unknown>,
) => QuerySuggestionsResponse
