import type {
  AiSuggestionsRequest,
  AiSuggestionsSearchRequest,
  Filter,
  SimpleFilter,
} from '@empathyco/x-types'
import type { AiState } from '../types'
import { map } from '@empathyco/x-utils'
import { Store } from 'vuex'
import { aiXStoreModule } from '../module'
import { resetAiStateWith } from './utils'

const selectedFiltersStub: Record<string, Filter[]> = {
  brand_facet: [
    {
      facetId: 'brand_facet',
      id: '{!tag=brand_facet}brand_facet:"Lego"',
      label: 'Lego',
      selected: true,
      totalResults: 6,
      modelName: 'SimpleFilter',
    },
  ] as SimpleFilter[],
}

describe('testing ai module getters', () => {
  const gettersKeys = map(aiXStoreModule.getters, getter => getter)
  const store: Store<AiState> = new Store(aiXStoreModule as any)

  beforeEach(() => {
    resetAiStateWith(store)
  })

  describe(`${gettersKeys.suggestionsRequest} getter`, () => {
    it('should return a request object', () => {
      resetAiStateWith(store, {
        query: 'ai cheese',
        params: { catalog: 'en' },
        selectedFilters: selectedFiltersStub,
        origin: 'related_prompts:results',
      })

      expect(store.getters[gettersKeys.suggestionsRequest]).toEqual<AiSuggestionsRequest>({
        query: 'ai cheese',
        extraParams: { catalog: 'en' },
        filters: selectedFiltersStub,
        origin: 'related_prompts:results',
      })
    })
  })

  describe(`${gettersKeys.suggestionsSearchRequest} getter`, () => {
    const queriesStub = [
      { query: 'ai cheese', categories: ['a'] },
      { query: 'ai chorizo', categories: [] },
    ]

    it('should return a request object', () => {
      resetAiStateWith(store, {
        queries: queriesStub,
        params: { catalog: 'en' },
        selectedFilters: selectedFiltersStub,
        origin: 'related_prompts:results',
      })

      expect(
        store.getters[gettersKeys.suggestionsSearchRequest],
      ).toEqual<AiSuggestionsSearchRequest>({
        queries: queriesStub,
        extraParams: { catalog: 'en' },
        filters: selectedFiltersStub,
        origin: 'related_prompts:results',
      })
    })

    it('should return null if there are no queries', () => {
      resetAiStateWith(store, { queries: [] })

      expect(store.getters[gettersKeys.suggestionsSearchRequest]).toBeNull()
    })

    it('should no propagate null if origin is null', () => {
      resetAiStateWith(store, {
        queries: queriesStub,
        origin: null,
      })

      expect(
        store.getters[gettersKeys.suggestionsSearchRequest],
      ).toEqual<AiSuggestionsSearchRequest>({
        queries: queriesStub,
        extraParams: {},
        filters: {},
      })
    })
  })
})
