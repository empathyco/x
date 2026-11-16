import type { AiSuggestionsSearchRequest } from '@empathyco/x-types'
import type { PlatformAiSuggestionsSearchRequest } from '../../../types'
import { zSchemaMapperFactory } from '@empathyco/x-adapter'
import { aiSuggestionsSearchRequestSchema } from '../../../schemas'

/**
 * Default implementation for the aiSuggestionsSearchRequestMapper.
 *
 * @public
 */
export const aiSuggestionsSearchRequestMapper = zSchemaMapperFactory<
  AiSuggestionsSearchRequest,
  PlatformAiSuggestionsSearchRequest
>(aiSuggestionsSearchRequestSchema)
