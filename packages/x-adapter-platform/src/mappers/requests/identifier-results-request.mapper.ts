import type { IdentifierResultsRequest } from '@empathyco/x-types'
import type { PlatformIdentifierResultsRequest } from '../../types/requests/identifier-results-request.model'

import { transformSchemaMapperFactory } from '@empathyco/x-adapter'

import { identifierResultsRequestSchema } from '../../schemas/requests/identifier-results-request.schema'

/**
 * Default mapper for IdentifierResultsRequest.
 *
 * @public
 */
export const identifierResultsRequestMapper = transformSchemaMapperFactory<
  IdentifierResultsRequest,
  PlatformIdentifierResultsRequest
>(identifierResultsRequestSchema)
