import type { FacetsResponse } from '@empathyco/x-types'
import type { PlatformFacetsResponse } from '../../types/responses/facets-response.model'
import { schemaMapperFactory } from '@empathyco/x-adapter'
import { facetsResponseSchema } from '../../schemas/responses/facets-response.schema'

/**
 * Default implementation for the FacetsResponseMapper.
 *
 * @public
 */
export const facetsResponseMapper = schemaMapperFactory<PlatformFacetsResponse, FacetsResponse>(
  facetsResponseSchema,
)
