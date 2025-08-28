import type { AiOverviewSuggestionsSearchResponse } from '@empathyco/x-types'
import type { PlatformAiOverviewSuggestionsSearchResponse } from '../../../types'
import { createMutableSchema } from '@empathyco/x-adapter'

/**
 * Default implementation for the AIOverviewSuggestionsSearchSchema.
 *
 * @public
 */
export const aiOverviewSuggestionsSearchSchema = createMutableSchema<
  PlatformAiOverviewSuggestionsSearchResponse,
  AiOverviewSuggestionsSearchResponse
>({
  items: 'items',
})
