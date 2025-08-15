import type { AIQuestionsRequest } from '@empathyco/x-types'
import type { PlatformAIQuestionsRequest } from '../../../types'
import { createMutableSchema } from '@empathyco/x-adapter'

export const AIQuestionsRequestSchema = createMutableSchema<
  AIQuestionsRequest,
  PlatformAIQuestionsRequest
>({
  context: {
    query: 'query',
    lang: 'lang',
    instance: 'extraParams.instance',
    filters: 'extraParams.filters',
  },
})
