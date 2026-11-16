import type { IdentifierResultsResponse } from '@empathyco/x-types'
import type { PlatformIdentifierResultsResponse } from '../../types/responses/identifier-results-response.model'

import { transformSchemaMapperFactory } from '@empathyco/x-adapter'

import { identifierResultsResponseSchema } from '../../schemas/responses/identifier-results-response.schema'

/**
 * Default implementation for the IdentifierResultsResponseMapper.
 *
 * @public
 */
export const identifierResultsResponseMapper = transformSchemaMapperFactory<
  PlatformIdentifierResultsResponse,
  IdentifierResultsResponse
>(identifierResultsResponseSchema)
