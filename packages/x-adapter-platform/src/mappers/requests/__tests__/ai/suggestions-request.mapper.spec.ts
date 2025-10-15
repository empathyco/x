import type { AiSuggestionsRequest } from '@empathyco/x-types'
import { filtersStub, mappedFiltersStub } from '../../../../__tests__/__fixtures__/filter'
import { aiSuggestionsRequestMapper } from '../../ai'

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

describe('aiSuggestionsRequestMapper', () => {
  it('should map the request correctly with all params', () => {
    expect(aiSuggestionsRequestMapper(aiSuggestionsRequestStub, {})).toStrictEqual({
      context: {
        query: 'test',
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
    const { filters, ...requestWithoutFilters } = aiSuggestionsRequestStub

    expect(aiSuggestionsRequestMapper(requestWithoutFilters, {})).toStrictEqual({
      context: {
        query: 'test',
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
