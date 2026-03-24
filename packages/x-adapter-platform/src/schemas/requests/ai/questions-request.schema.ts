import type { AiQuestionsRequest } from '@empathyco/x-types'
import type { PlatformAiQuestionsRequest } from '../../../types'
import { createMutableSchema } from '@empathyco/x-adapter'

/**
 * Default implementation for the AiQuestionsRequestSchema.
 *
 * @public
 */
export const aiQuestionsRequestSchema = createMutableSchema<
  AiQuestionsRequest,
  PlatformAiQuestionsRequest
>({
  context: ({ lang, query, extraParams }): PlatformAiQuestionsRequest['context'] => {
    const context: PlatformAiQuestionsRequest['context'] = { lang, query }
    if (extraParams && typeof extraParams === 'object') {
      if ('instance' in extraParams) {
        context.instance = (extraParams as { instance?: string }).instance
      }
      if ('filters' in extraParams) {
        context.filters = (extraParams as { filters?: Record<string, unknown> }).filters
      }
    }
    return context
  },
})
