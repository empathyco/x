import type { AiSuggestionsSearchResponse } from '@empathyco/x-types'
import type { PlatformAiSuggestionsSearchResponse } from '../../../types'
import { schemaMapperFactory } from '@empathyco/x-adapter'
import { aiSuggestionsSearchResponseSchema } from '../../../schemas'

/**
 * Default implementation for the AiSuggestionsSearchResponseMapper.
 *
 * @public
 */
export const aiSuggestionsSearchResponseMapper = schemaMapperFactory<
  PlatformAiSuggestionsSearchResponse,
  AiSuggestionsSearchResponse
>(aiSuggestionsSearchResponseSchema)
