import type { AiSuggestionsRequest } from '@empathyco/x-types'
import { filtersStub } from '../filter'

export const aiSuggestionsRequestStub: AiSuggestionsRequest = {
  query: 'test',
  extraParams: {
    lang: 'es',
    instance: 'empathy',
    env: 'test',
  },
  filters: filtersStub,
  origin: 'origin',
}
