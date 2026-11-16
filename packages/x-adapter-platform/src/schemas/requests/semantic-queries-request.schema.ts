import type { SemanticQueriesRequest } from '@empathyco/x-types'
import type { PlatformSemanticQueriesRequest } from '../../types'
import { createTransformSchema } from '@empathyco/x-adapter'
import { defined } from '../utils'

/**
 * Default implementation for the SemanticQueriesRequestSchema.
 *
 * @remarks The request is created by our own code, so it is not validated.
 * @public
 */
export const semanticQueriesRequestSchema = createTransformSchema<
  SemanticQueriesRequest,
  PlatformSemanticQueriesRequest
>({
  transform: (source): PlatformSemanticQueriesRequest =>
    defined<PlatformSemanticQueriesRequest>({
      q: source.query,
      extraParams: source.extraParams,
    }),
})
