import type { AiSuggestionsSearchRequest } from '@empathyco/x-types'
import { filtersStub } from '../filter'

export const aiSuggestionsSearchRequestRequestStub: AiSuggestionsSearchRequest = {
  queries: [],
  extraParams: {
    lang: 'es',
    instance: 'empathy',
    env: 'test',
  },
  filters: filtersStub,
  origin: 'origin',
}
