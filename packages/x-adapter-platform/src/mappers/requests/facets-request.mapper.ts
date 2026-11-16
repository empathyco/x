import type { FacetsRequest } from '@empathyco/x-types'
import type { PlatformFacetsRequest } from '../../types/requests/facets-request.model'
import { transformSchemaMapperFactory } from '@empathyco/x-adapter'
import { facetsRequestSchema } from '../../schemas/requests/facets-request.schema'

/**
 * Default implementation for the FacetsRequestMapper.
 *
 * @public
 */
export const facetsRequestMapper = transformSchemaMapperFactory<
  FacetsRequest,
  PlatformFacetsRequest
>(facetsRequestSchema)
