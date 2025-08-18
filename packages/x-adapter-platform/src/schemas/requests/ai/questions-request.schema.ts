import type { AiQuestionsRequest } from '@empathyco/x-types'
import type { PlatformAiQuestionsRequest } from '../../../types'
import { createMutableSchema } from '@empathyco/x-adapter'

export const AiQuestionsRequestSchema = createMutableSchema<
  AiQuestionsRequest,
  PlatformAiQuestionsRequest
>({
  context: {
    query: 'query',
    lang: 'lang',
    instance: 'extraParams.instance',
    filters: 'extraParams.filters',
  },
})
