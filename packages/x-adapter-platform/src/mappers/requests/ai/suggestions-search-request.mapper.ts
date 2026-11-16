import type { AiSuggestionsSearchRequest } from '@empathyco/x-types'
import type { PlatformAiSuggestionsSearchRequest } from '../../../types'
import { transformSchemaMapperFactory } from '@empathyco/x-adapter'
import { aiSuggestionsSearchRequestSchema } from '../../../schemas'

/**
 * Default implementation for the aiSuggestionsSearchRequestMapper.
 *
 * @public
 */
export const aiSuggestionsSearchRequestMapper = transformSchemaMapperFactory<
  AiSuggestionsSearchRequest,
  PlatformAiSuggestionsSearchRequest
>(aiSuggestionsSearchRequestSchema)
