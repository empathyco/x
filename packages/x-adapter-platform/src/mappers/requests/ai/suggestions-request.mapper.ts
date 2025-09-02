import type { AiSuggestionsRequest } from '@empathyco/x-types'
import type { PlatformAiSuggestionsRequest } from '../../../types'
import { schemaMapperFactory } from '@empathyco/x-adapter'
import { aiSuggestionsRequestSchema } from '../../../schemas/requests/ai/suggestions-request.schema'

/**
 * Default implementation for the aiSuggestionsRequestMapper.
 *
 * @public
 */
export const aiSuggestionsRequestMapper = schemaMapperFactory<
  AiSuggestionsRequest,
  PlatformAiSuggestionsRequest
>(aiSuggestionsRequestSchema)
