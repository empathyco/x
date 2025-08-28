import type { AiOverviewSuggestionsSearchResponse } from '@empathyco/x-types'
import type { PlatformAiOverviewSuggestionsSearchResponse } from '../../../types'
import { createMutableSchema } from '@empathyco/x-adapter'
import { aiOverviewSuggestionsSearchSchema } from '../../models'

/**
 * Default implementation for the AIOverviewSuggestionsSearchResponseSchema.
 *
 * @public
 */

export const aiOverviewSuggestionsSearchResponseSchema = createMutableSchema<
  PlatformAiOverviewSuggestionsSearchResponse,
  AiOverviewSuggestionsSearchResponse
>(aiOverviewSuggestionsSearchSchema)
