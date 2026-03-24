import type { AiSuggestionsSearchResponse } from '@empathyco/x-types'
import type { PlatformAiSuggestionsSearchResponse } from '../../../types/responses'
import { createMutableSchema } from '@empathyco/x-adapter'
import { aiSuggestionsSearchSchema } from '../../models/ai/suggestions-search.schema'

/**
 * Default implementation for the AIOverviewSuggestionsSearchResponseSchema.
 * @public
 */
export const aiSuggestionsSearchResponseSchema = createMutableSchema<
  PlatformAiSuggestionsSearchResponse,
  AiSuggestionsSearchResponse
>(aiSuggestionsSearchSchema)
