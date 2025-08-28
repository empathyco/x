import type { AiOverviewSuggestionsSearchResponse } from '@empathyco/x-types'
import type { PlatformAiOverviewSuggestionsSearchResponse } from '../../../types'
import { schemaMapperFactory } from '@empathyco/x-adapter'
import { aiOverviewSuggestionsSearchResponseSchema } from '../../../schemas'

/**
 * Default implementation for the AiOverviewSuggestionsSearchResponseMapper.
 *
 * @public
 */
export const aiOverviewSuggestionsSearchResponseMapper = schemaMapperFactory<
  PlatformAiOverviewSuggestionsSearchResponse,
  AiOverviewSuggestionsSearchResponse
>(aiOverviewSuggestionsSearchResponseSchema)
