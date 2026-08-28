import type { AiSuggestionsRequest } from '@empathyco/x-types'
import type { PlatformAiSuggestionsRequest } from '../../../types'
import { zSchemaMapperFactory } from '@empathyco/x-adapter'
import { aiSuggestionsRequestSchema } from '../../../schemas/requests/ai/suggestions-request.schema'

/**
 * Default implementation for the aiSuggestionsRequestMapper.
 *
 * @public
 */
export const aiSuggestionsRequestMapper = zSchemaMapperFactory<
  AiSuggestionsRequest,
  PlatformAiSuggestionsRequest
>(aiSuggestionsRequestSchema)
