import { aiSuggestionsRequestStub } from '../../../../__tests__/__fixtures__/ai/suggestions.request'
import { mappedFiltersStub } from '../../../../__tests__/__fixtures__/filter'
import { aiSuggestionsRequestMapper } from '../../ai'

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
