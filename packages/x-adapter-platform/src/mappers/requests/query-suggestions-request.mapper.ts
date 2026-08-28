import type { QuerySuggestionsRequest } from '@empathyco/x-types'
import type { PlatformQuerySuggestionsRequest } from '../../types/requests/query-suggestions-request.model'
import { zSchemaMapperFactory } from '@empathyco/x-adapter'
import { querySuggestionsRequestSchema } from '../../schemas/requests/query-suggestions-request.schema'

/**
 * Default implementation for the QuerySuggestionsRequestMapper.
 *
 * @public
 */
export const querySuggestionsRequestMapper = zSchemaMapperFactory<
  QuerySuggestionsRequest,
  PlatformQuerySuggestionsRequest
>(querySuggestionsRequestSchema)
