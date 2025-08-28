import type { AiOverviewSuggestionsSearchRequest } from '@empathyco/x-types'
import type { PlatformAiOverviewSuggestionsSearchRequest } from '../../../types'
import { schemaMapperFactory } from '@empathyco/x-adapter'
import { aiOverviewSuggestionsSearchRequestSchema } from '../../../schemas'

/**
 * Default implementation for the aiOverviewSuggestionsSearchRequestMapper.
 *
 * @public
 */
export const aiOverviewSuggestionsSearchRequestMapper = schemaMapperFactory<
  AiOverviewSuggestionsSearchRequest,
  PlatformAiOverviewSuggestionsSearchRequest
>(aiOverviewSuggestionsSearchRequestSchema)
