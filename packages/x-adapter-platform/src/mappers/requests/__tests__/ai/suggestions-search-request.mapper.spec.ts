import type { AiSuggestionsSearchRequest } from '@empathyco/x-types'
import { describe, expect, it } from 'vitest'
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
  excludeOptions: {
    resultIds: ['product-1', 'product-2'],
  },
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
      excludeOptions: {
        resultIds: ['product-1', 'product-2'],
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
      excludeOptions: {
        resultIds: ['product-1', 'product-2'],
      },
    })
  })

  it('should include empty excludeOptions when resultIds is empty', () => {
    const requestWithEmptyExcludeOptions = {
      ...aiSuggestionsSearchRequestRequestStub,
      excludeOptions: { resultIds: [] },
    }

    const mapped = aiSuggestionsSearchRequestMapper(requestWithEmptyExcludeOptions, {})
    expect(mapped.excludeOptions).toStrictEqual({ resultIds: [] })
  })

  it('should include default excludeOptions when not provided', () => {
    const { excludeOptions, ...requestWithoutExcludeOptions } =
      aiSuggestionsSearchRequestRequestStub

    const mapped = aiSuggestionsSearchRequestMapper(
      requestWithoutExcludeOptions as AiSuggestionsSearchRequest,
      {},
    )
    expect(mapped.excludeOptions).toStrictEqual({ resultIds: [] })
  })
})
