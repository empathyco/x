import {
  Facet,
  Filter,
  HistoryQuery,
  NextQuery,
  PartialResult,
  Redirection,
  RelatedTag,
  Result,
  SemanticQuery,
  Suggestion
} from '@empathyco/x-types';
import { ComputedRef } from 'vue';
import { ScrollComponentState } from '../x-modules/scroll/store/types';
import { InputStatus } from '../x-modules/search-box/store/types';
import { RequestStatus } from '../store/utils/status-store.utils';
import { useStore } from './use-store';
import { useGetter } from './use-getter';
import { useState } from './use-state';

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
    'search'
  ] as const;
  const statusModules = [
    'identifierResults',
    'nextQueries',
    'popularSearches',
    'querySuggestions',
    'recommendations',
    'relatedTags',
    'search'
  ] as const;

  const store = useStore();

  const query = queryModules.reduce((acc, moduleName) => {
    return Object.defineProperty(acc, moduleName, {
      get(): string {
        return store.state.x[moduleName]?.query ?? '';
      },
      enumerable: true
    });
  }, {} as UseAliasQueryAPI);

  const status = statusModules.reduce((acc, moduleName) => {
    return Object.defineProperty(acc, moduleName, {
      get(): RequestStatus | undefined {
        return store.state.x[moduleName]?.status;
      },
      enumerable: true
    });
  }, {} as UseAliasStatusAPI);

  const searchState = useState('search', [
    'fromNoResultsWithFilters',
    'isNoResults',
    'partialResults',
    'redirections',
    'results',
    'spellcheckedQuery',
    'totalResults',
    'sort'
  ]);

  const historyQueriesState = useState('historyQueries', ['historyQueries', 'isEnabled']);

  const historyQueriesGetter = useGetter('historyQueries', [
    'historyQueries',
    'historyQueriesWithResults'
  ]);

  const facetsGetter = useGetter('facets', ['selectedFilters', 'facets']);

  return {
    query,
    status,
    device: useState('device', ['name']).name ?? null,
    facets: facetsGetter.facets ?? {},
    historyQueries: historyQueriesGetter.historyQueries ?? [],
    historyQueriesWithResults: historyQueriesGetter.historyQueriesWithResults ?? [],
    fullHistoryQueries: historyQueriesState.historyQueries ?? [],
    isHistoryQueriesEnabled: historyQueriesState.isEnabled ?? false,
    fromNoResultsWithFilters: searchState.fromNoResultsWithFilters ?? false,
    identifierResults: useState('identifierResults', ['identifierResults']).identifierResults ?? [],
    searchBoxStatus: useState('searchBox', ['inputStatus']).inputStatus ?? undefined,
    isEmpathizeOpen: useState('empathize', ['isOpen']).isOpen ?? false,
    nextQueries: useGetter('nextQueries', ['nextQueries']).nextQueries ?? [],
    noResults: searchState.isNoResults ?? false,
    partialResults: searchState.partialResults ?? [],
    popularSearches: useState('popularSearches', ['popularSearches']).popularSearches ?? [],
    querySuggestions: useGetter('querySuggestions', ['querySuggestions']).querySuggestions ?? [],
    fullQuerySuggestions: useState('querySuggestions', ['suggestions']).suggestions ?? [],
    recommendations: useState('recommendations', ['recommendations']).recommendations ?? [],
    redirections: searchState.redirections ?? [],
    relatedTags: useGetter('relatedTags', ['relatedTags']).relatedTags ?? [],
    results: searchState.results ?? [],
    scroll: useState('scroll', ['data']).data ?? {},
    selectedFilters: facetsGetter.selectedFilters ?? [],
    selectedRelatedTags: useState('relatedTags', ['selectedRelatedTags']).selectedRelatedTags ?? [],
    semanticQueries: useState('semanticQueries', ['semanticQueries']).semanticQueries ?? [],
    spellcheckedQuery: searchState.spellcheckedQuery ?? null,
    totalResults: searchState.totalResults ?? 0,
    selectedSort: searchState.sort ?? ''
  };
}

/**
 * Alias to facilitate retrieving values from the store.
 *
 * @public
 */
export interface UseAliasAPI {
  /** The {@link DeviceXModule} detected device. */
  readonly device: ComputedRef<string | null>;
  /** The {@link FacetsXModule} facets. */
  readonly facets: ComputedRef<ReadonlyArray<Facet>>;
  /** The {@link HistoryQueriesXModule} history queries matching the query. */
  readonly historyQueries: ComputedRef<ReadonlyArray<HistoryQuery>>;
  /** The {@link HistoryQueriesXModule} history queries with 1 or more results. */
  readonly historyQueriesWithResults: ComputedRef<ReadonlyArray<HistoryQuery>>;
  /** The {@link HistoryQueriesXModule} history queries. */
  readonly fullHistoryQueries: ComputedRef<ReadonlyArray<HistoryQuery>>;
  /** The {@link HistoryQueriesXModule} history queries enabled flag. */
  readonly isHistoryQueriesEnabled: ComputedRef<Readonly<boolean>>;
  /** The {@link SearchXModule} no results with filters flag. */
  readonly fromNoResultsWithFilters: ComputedRef<Readonly<boolean>>;
  /** The {@link IdentifierResultsXModule} results. */
  readonly identifierResults: ComputedRef<ReadonlyArray<Result>>;
  /** The {@link SearchBoxXModule } input status. */
  readonly searchBoxStatus: ComputedRef<InputStatus | undefined>;
  /** The {@link Empathize} is open state. */
  readonly isEmpathizeOpen: ComputedRef<boolean>;
  /** The {@link NextQueriesXModule} next queries. */
  readonly nextQueries: ComputedRef<ReadonlyArray<NextQuery>>;
  /** The {@link SearchXModule} no results situation. */
  readonly noResults: ComputedRef<boolean>;
  /** The {@link SearchXModule} partial results. */
  readonly partialResults: ComputedRef<ReadonlyArray<PartialResult>>;
  /** The {@link PopularSearchesXModule} popular searches. */
  readonly popularSearches: ComputedRef<ReadonlyArray<Suggestion>>;
  /** The query value of the different modules. */
  readonly query: UseAliasQueryAPI;
  /** The {@link QuerySuggestionsXModule} query suggestions that should be displayed. */
  readonly querySuggestions: ComputedRef<ReadonlyArray<Suggestion>>;
  /** The {@link QuerySuggestionsXModule} query suggestions. */
  readonly fullQuerySuggestions: ComputedRef<ReadonlyArray<Suggestion>>;
  /** The {@link RecommendationsXModule} recommendations. */
  readonly recommendations: ComputedRef<ReadonlyArray<Result>>;
  /** The {@link SearchXModule} redirections. */
  readonly redirections: ComputedRef<ReadonlyArray<Redirection>>;
  /** The {@link RelatedTagsXModule} related tags (Both selected and deselected). */
  readonly relatedTags: ComputedRef<ReadonlyArray<RelatedTag>>;
  /** The {@link SearchXModule} search results. */
  readonly results: ComputedRef<ReadonlyArray<Result>>;
  /** The {@link ScrollXModule} data state. */
  readonly scroll: ComputedRef<Record<string, ScrollComponentState>>;
  /** The {@link FacetsXModule} selected filters. */
  readonly selectedFilters: ComputedRef<Filter[]>;
  /** The {@link RelatedTagsXModule} selected related tags. */
  readonly selectedRelatedTags: ComputedRef<ReadonlyArray<RelatedTag>>;
  /** The {@link SemanticQueriesXModule} queries. */
  readonly semanticQueries: ComputedRef<ReadonlyArray<SemanticQuery>>;
  /** The {@link SearchXModule} spellchecked query. */
  readonly spellcheckedQuery: ComputedRef<string | null>;
  /** The status value of the different modules. */
  readonly status: UseAliasStatusAPI;
  /** The {@link SearchXModule} total results. */
  readonly totalResults: ComputedRef<number>;
  /** The {@link SearchXModule} selected sort. */
  readonly selectedSort: ComputedRef<string>;
}

/**
 * Alias to facilitate retrieving the modules with query.
 *
 * @public
 */
export interface UseAliasQueryAPI {
  /** The {@link FacetsXModule} query. */
  readonly facets: string;
  /** The {@link SearchBoxXModule} query. */
  readonly searchBox: string;
  /** The {@link NextQueriesXModule} query. */
  readonly nextQueries: string;
  /** The {@link QuerySuggestionsXModule} query. */
  readonly querySuggestions: string;
  /** The {@link RelatedTagsXModule} query. */
  readonly relatedTags: string;
  /** The {@link SearchXModule} query. */
  readonly search: string;
}

/**
 * Alias to facilitate retrieving the modules with status.
 *
 * @public
 */
export interface UseAliasStatusAPI {
  /** The {@link IdentifierResultsXModule} status. */
  readonly identifierResults: RequestStatus | undefined;
  /** The {@link NextQueriesXModule} status. */
  readonly nextQueries: RequestStatus | undefined;
  /** The {@link PopularSearchesXModule} status. */
  readonly popularSearches: RequestStatus | undefined;
  /** The {@link QuerySuggestionsXModule} status. */
  readonly querySuggestions: RequestStatus | undefined;
  /** The {@link RecommendationsXModule} status. */
  readonly recommendations: RequestStatus | undefined;
  /** The {@link RelatedTagsXModule} status. */
  readonly relatedTags: RequestStatus | undefined;
  /** The {@link SearchXModule} status. */
  readonly search: RequestStatus | undefined;
}
