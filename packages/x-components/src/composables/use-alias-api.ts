import type {
  Facet,
  Filter,
  HistoryQuery,
  NextQuery,
  PartialResult,
  Redirection,
  RelatedTag,
  Result,
  SemanticQuery,
  Suggestion,
} from '@empathyco/x-types'
import type { RequestStatus } from '../store/utils/status-store.utils'
import type { ScrollComponentState } from '../x-modules/scroll/store/types'
import type { InputStatus } from '../x-modules/search-box/store/types'
import { useStore } from 'vuex'
import { getGetterPath } from '../plugins/index'

/* eslint-disable ts/no-unsafe-return,ts/no-unsafe-member-access,ts/no-unsafe-assignment */

/**
 * Creates an object containing the alias part of {@link XComponentAPI}.
 *
 * @returns An object containing the alias part of the {@link XComponentAPI}.
 *
 * @internal
 */
export function useAliasApi(): UseAliasAPI {
  const queryModules = [
    'facets',
    'searchBox',
    'nextQueries',
    'querySuggestions',
    'relatedTags',
    'search',
  ] as const
  const statusModules = [
    'identifierResults',
    'nextQueries',
    'popularSearches',
    'querySuggestions',
    'recommendations',
    'relatedTags',
    'search',
  ] as const

  const store = useStore()

  const query = queryModules.reduce((acc, moduleName) => {
    return Object.defineProperty(acc, moduleName, {
      get(): string {
        return store.state.x[moduleName]?.query ?? ''
      },
      enumerable: true,
    })
  }, {} as UseAliasQueryAPI)

  const status = statusModules.reduce((acc, moduleName) => {
    return Object.defineProperty(acc, moduleName, {
      get(): RequestStatus | undefined {
        return store.state.x[moduleName]?.status
      },
      enumerable: true,
    })
  }, {} as UseAliasStatusAPI)

  return {
    query,
    status,
    get device() {
      return store.state.x.device?.name ?? null
    },
    get facets() {
      return store.getters[getGetterPath('facets', 'facets')] ?? {}
    },
    get historyQueries() {
      return store.getters[getGetterPath('historyQueries', 'historyQueries')] ?? []
    },
    get historyQueriesWithResults() {
      return store.getters[getGetterPath('historyQueries', 'historyQueriesWithResults')] ?? []
    },
    get fullHistoryQueries() {
      return store.state.x.historyQueries?.historyQueries ?? []
    },
    get isHistoryQueriesEnabled() {
      return store.state.x.historyQueries?.isEnabled ?? false
    },
    get fromNoResultsWithFilters() {
      return store.state.x.search?.fromNoResultsWithFilters ?? false
    },
    get identifierResults() {
      return store.state.x.identifierResults?.identifierResults ?? []
    },
    get searchBoxStatus() {
      return store.state.x.searchBox?.inputStatus ?? undefined
    },
    get isEmpathizeOpen() {
      return store.state.x.empathize?.isOpen ?? false
    },
    get nextQueries() {
      return store.getters[getGetterPath('nextQueries', 'nextQueries')] ?? []
    },
    get noResults() {
      return store.state.x.search?.isNoResults ?? false
    },
    get partialResults() {
      return store.state.x.search?.partialResults ?? []
    },
    get popularSearches() {
      return store.state.x.popularSearches?.popularSearches ?? []
    },
    get querySuggestions() {
      return store.getters[getGetterPath('querySuggestions', 'querySuggestions')] ?? []
    },
    get fullQuerySuggestions() {
      return store.state.x.querySuggestions?.suggestions ?? []
    },
    get recommendations() {
      return store.state.x.recommendations?.recommendations ?? []
    },
    get redirections() {
      return store.state.x.search?.redirections ?? []
    },
    get relatedTags() {
      return store.getters[getGetterPath('relatedTags', 'relatedTags')] ?? []
    },
    get results() {
      return store.state.x.search?.results ?? []
    },
    get scroll() {
      return store.state.x.scroll?.data ?? {}
    },
    get selectedFilters() {
      return store.getters[getGetterPath('facets', 'selectedFilters')] ?? []
    },
    get selectedRelatedTags() {
      return store.state.x.relatedTags?.selectedRelatedTags ?? []
    },
    get semanticQueries() {
      return store.state.x.semanticQueries?.semanticQueries ?? []
    },
    get spellcheckedQuery() {
      return store.state.x.search?.spellcheckedQuery ?? null
    },
    get totalResults() {
      return store.state.x.search?.totalResults ?? 0
    },
    get selectedSort() {
      return store.state.x.search?.sort ?? ''
    },
    get priceStats() {
      return store.state.x.search?.stats?.price ?? {}
    },
  }
}

/**
 * Alias to facilitate retrieving values from the store.
 *
 * @public
 */
export interface UseAliasAPI {
  /** The {@link DeviceXModule} detected device. */
  readonly device: string | null
  /** The {@link FacetsXModule} facets. */
  readonly facets: Record<Facet['id'], Facet>
  /** The {@link HistoryQueriesXModule} history queries matching the query. */
  readonly historyQueries: ReadonlyArray<HistoryQuery>
  /** The {@link HistoryQueriesXModule} history queries with 1 or more results. */
  readonly historyQueriesWithResults: ReadonlyArray<HistoryQuery>
  /** The {@link HistoryQueriesXModule} history queries. */
  readonly fullHistoryQueries: ReadonlyArray<HistoryQuery>
  /** The {@link HistoryQueriesXModule} history queries enabled flag. */
  readonly isHistoryQueriesEnabled: Readonly<boolean>
  /** The {@link SearchXModule} no results with filters flag. */
  readonly fromNoResultsWithFilters: Readonly<boolean>
  /** The {@link IdentifierResultsXModule} results. */
  readonly identifierResults: ReadonlyArray<Result>
  /** The {@link SearchBoxXModule } input status. */
  readonly searchBoxStatus: InputStatus | undefined
  /** The {@link Empathize} is open state. */
  readonly isEmpathizeOpen: boolean
  /** The {@link NextQueriesXModule} next queries. */
  readonly nextQueries: ReadonlyArray<NextQuery>
  /** The {@link SearchXModule} no results situation. */
  readonly noResults: boolean
  /** The {@link SearchXModule} partial results. */
  readonly partialResults: ReadonlyArray<PartialResult>
  /** The {@link PopularSearchesXModule} popular searches. */
  readonly popularSearches: ReadonlyArray<Suggestion>
  /** The query value of the different modules. */
  readonly query: UseAliasQueryAPI
  /** The {@link QuerySuggestionsXModule} query suggestions that should be displayed. */
  readonly querySuggestions: ReadonlyArray<Suggestion>
  /** The {@link QuerySuggestionsXModule} query suggestions. */
  readonly fullQuerySuggestions: ReadonlyArray<Suggestion>
  /** The {@link RecommendationsXModule} recommendations. */
  readonly recommendations: ReadonlyArray<Result>
  /** The {@link SearchXModule} redirections. */
  readonly redirections: ReadonlyArray<Redirection>
  /** The {@link RelatedTagsXModule} related tags (Both selected and deselected). */
  readonly relatedTags: ReadonlyArray<RelatedTag>
  /** The {@link SearchXModule} search results. */
  readonly results: ReadonlyArray<Result>
  /** The {@link ScrollXModule} data state. */
  readonly scroll: Record<string, ScrollComponentState>
  /** The {@link FacetsXModule} selected filters. */
  readonly selectedFilters: Filter[]
  /** The {@link RelatedTagsXModule} selected related tags. */
  readonly selectedRelatedTags: ReadonlyArray<RelatedTag>
  /** The {@link SemanticQueriesXModule} queries. */
  readonly semanticQueries: ReadonlyArray<SemanticQuery>
  /** The {@link SearchXModule} spellchecked query. */
  readonly spellcheckedQuery: string | null
  /** The status value of the different modules. */
  readonly status: UseAliasStatusAPI
  /** The {@link SearchXModule} total results. */
  readonly totalResults: number
  /** The {@link SearchXModule} selected sort. */
  readonly selectedSort: string
  /** The {@link SearchXModule} price specific stats. */
  readonly priceStats: { min: number; max: number }
}

/**
 * Alias to facilitate retrieving the modules with query.
 *
 * @public
 */
export interface UseAliasQueryAPI {
  /** The {@link FacetsXModule} query. */
  readonly facets: string
  /** The {@link SearchBoxXModule} query. */
  readonly searchBox: string
  /** The {@link NextQueriesXModule} query. */
  readonly nextQueries: string
  /** The {@link QuerySuggestionsXModule} query. */
  readonly querySuggestions: string
  /** The {@link RelatedTagsXModule} query. */
  readonly relatedTags: string
  /** The {@link SearchXModule} query. */
  readonly search: string
}

/**
 * Alias to facilitate retrieving the modules with status.
 *
 * @public
 */
export interface UseAliasStatusAPI {
  /** The {@link IdentifierResultsXModule} status. */
  readonly identifierResults: RequestStatus | undefined
  /** The {@link NextQueriesXModule} status. */
  readonly nextQueries: RequestStatus | undefined
  /** The {@link PopularSearchesXModule} status. */
  readonly popularSearches: RequestStatus | undefined
  /** The {@link QuerySuggestionsXModule} status. */
  readonly querySuggestions: RequestStatus | undefined
  /** The {@link RecommendationsXModule} status. */
  readonly recommendations: RequestStatus | undefined
  /** The {@link RelatedTagsXModule} status. */
  readonly relatedTags: RequestStatus | undefined
  /** The {@link SearchXModule} status. */
  readonly search: RequestStatus | undefined
}

/* eslint-enable ts/no-unsafe-return,ts/no-unsafe-member-access,ts/no-unsafe-assignment */
