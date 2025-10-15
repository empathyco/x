import type { AiSuggestionsSearchRequest } from '@empathyco/x-types'
import { filtersStub, mappedFiltersStub } from '../../../../__tests__/__fixtures__/filter'
import { aiSuggestionsSearchRequestMapper } from '../../ai/suggestions-search-request.mapper'

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

describe('aiSuggestionsSearchRequestMapper tests', () => {
  it('should map the request correctly with all params', () => {
    expect(
      aiSuggestionsSearchRequestMapper(aiSuggestionsSearchRequestRequestStub, {}),
    ).toStrictEqual({
      queries: [],
      context: {
        lang: 'es',
        instance: 'empathy',
        filters: {
          env: 'test',
          origin: 'origin',
          filters: mappedFiltersStub,
        },
      },
    })
  })

  it('should map the request correctly when there is no filters', () => {
    const { filters, ...requestWithoutFilters } = aiSuggestionsSearchRequestRequestStub

    expect(aiSuggestionsSearchRequestMapper(requestWithoutFilters, {})).toStrictEqual({
      queries: [],
      context: {
        lang: 'es',
        instance: 'empathy',
        filters: {
          env: 'test',
          origin: 'origin',
        },
      },
    })
  })
})
