import type { AiSuggestionsSearchResponse } from '@empathyco/x-types'
import type { PlatformAiSuggestionsSearchResponse } from '../../../types'
import { zSchemaMapperFactory } from '@empathyco/x-adapter'
import { aiSuggestionsSearchResponseSchema } from '../../../schemas/responses/ai/suggestions-search-response.schema'

/**
 * Default implementation for the AiSuggestionsSearchResponseMapper.
 * @public
 */
export const aiSuggestionsSearchResponseMapper = zSchemaMapperFactory<
  PlatformAiSuggestionsSearchResponse,
  AiSuggestionsSearchResponse
>(aiSuggestionsSearchResponseSchema)
