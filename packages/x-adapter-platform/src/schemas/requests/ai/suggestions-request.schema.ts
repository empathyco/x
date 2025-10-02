import type { AiSuggestionsRequest } from '@empathyco/x-types'
import type { PlatformAiSuggestionsRequest } from '../../../types'
import { createMutableSchema } from '@empathyco/x-adapter'

/**
 * Default implementation for the aiSuggestionsRequestSchema.
 *
 * @public
 */
export const aiSuggestionsRequestSchema = createMutableSchema<
  AiSuggestionsRequest,
  PlatformAiSuggestionsRequest
>({
  context: ({ query, extraParams, origin }) => {
    const { lang, instance, ...restExtraParams } = extraParams ?? {}

    return {
      query,
      lang: (lang as string | undefined) ?? '',
      instance: (instance as string | undefined) ?? '',
      filters: { ...restExtraParams, origin },
    }
  },
})
