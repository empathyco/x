import type { AiSuggestionsSearchResponse } from '@empathyco/x-types'
import type { PlatformAiSuggestionsSearchResponse } from '../../../types/responses'
import { z } from 'zod'
import { aiSuggestionsSearchSchema } from '../../models/ai/suggestions-search.schema'

/**
 * Default implementation for the AIOverviewSuggestionsSearchResponseSchema.
 * @public
 */
export const aiSuggestionsSearchResponseSchema = z
  .any()
  .transform(
    (source): AiSuggestionsSearchResponse =>
      aiSuggestionsSearchSchema.parse(source as PlatformAiSuggestionsSearchResponse),
  )
