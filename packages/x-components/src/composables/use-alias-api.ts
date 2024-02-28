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
import { ScrollComponentState } from '../x-modules/scroll/index';
import { InputStatus } from '../x-modules/search-box/index';
import { XComponentAliasQueryAPI, XComponentAliasStatusAPI } from '../plugins/index';
import { RequestStatus } from '../store/index';
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

  return {
    query,
    status,
    get device() {
      const deviceName = useState('device', ['name']);
      return deviceName?.name.value ?? null;
    },
    get facets() {
      return useGetter('facets', ['facets']).facets.value ?? {};
    },
    get historyQueries() {
      return useGetter('historyQueries', ['historyQueries']) ?? [];
    },
    get historyQueriesWithResults() {
      return useGetter('historyQueries', ['historyQueriesWithResults']) ?? [];
    },
    get fullHistoryQueries() {
      return useState('historyQueries', ['historyQueries']) ?? [];
    },
    get isHistoryQueriesEnabled() {
      return useState('historyQueries', ['isEnabled']) ?? false;
    },
    get fromNoResultsWithFilters() {
      return useState('search', ['fromNoResultsWithFilters']) ?? false;
    },
    get identifierResults() {
      return useState('identifierResults', ['identifierResults']) ?? [];
    },
    get searchBoxStatus() {
      return useState('searchBox', ['inputStatus']) ?? undefined;
    },
    get isEmpathizeOpen() {
      return useState('empathize', ['isOpen']) ?? false;
    },
    get nextQueries() {
      return useGetter('nextQueries', ['nextQueries']) ?? [];
    },
    get noResults() {
      return useState('search', ['isNoResults']) ?? false;
    },
    get partialResults() {
      return useState('search', ['partialResults']) ?? [];
    },
    get popularSearches() {
      return useState('popularSearches', ['popularSearches']) ?? [];
    },
    get querySuggestions() {
      return useGetter('querySuggestions', ['querySuggestions']) ?? [];
    },
    get fullQuerySuggestions() {
      return useState('querySuggestions', ['suggestions']) ?? [];
    },
    get recommendations() {
      return useState('recommendations', ['recommendations']) ?? [];
    },
    get redirections() {
      return useState('search', ['redirections']) ?? [];
    },
    get relatedTags() {
      return useGetter('relatedTags', ['relatedTags']) ?? [];
    },
    get results() {
      return useState('search', ['results']) ?? [];
    },
    get scroll() {
      return useState('scroll', ['data']) ?? {};
    },
    get selectedFilters() {
      return useGetter('facets', ['selectedFilters']) ?? [];
    },
    get selectedRelatedTags() {
      return useState('relatedTags', ['selectedRelatedTags']) ?? [];
    },
    get semanticQueries() {
      return useState('semanticQueries', ['semanticQueries']) ?? [];
    },
    get spellcheckedQuery() {
      return useState('search', ['spellcheckedQuery']) ?? null;
    },
    get totalResults() {
      return useState('search', ['totalResults']) ?? 0;
    },
    get selectedSort() {
      return useState('search', ['sort']) ?? '';
    }
  };
}

/**
 * Alias to facilitate retrieving values from the store.
 *
 * @public
 */
interface UseAliasAPI {
  /** The {@link DeviceXModule} detected device. */
  readonly device: string | null;
  /** The {@link FacetsXModule} facets. */
  readonly facets: ReadonlyArray<Facet>;
  /** The {@link HistoryQueriesXModule} history queries matching the query. */
  readonly historyQueries: ReadonlyArray<HistoryQuery>;
  /** The {@link HistoryQueriesXModule} history queries with 1 or more results. */
  readonly historyQueriesWithResults: ReadonlyArray<HistoryQuery>;
  /** The {@link HistoryQueriesXModule} history queries. */
  readonly fullHistoryQueries: ReadonlyArray<HistoryQuery>;
  /** The {@link HistoryQueriesXModule} history queries enabled flag. */
  readonly isHistoryQueriesEnabled: Readonly<boolean>;
  /** The {@link SearchXModule} no results with filters flag. */
  readonly fromNoResultsWithFilters: Readonly<boolean>;
  /** The {@link IdentifierResultsXModule} results. */
  readonly identifierResults: ReadonlyArray<Result>;
  /** The {@link SearchBoxXModule } input status. */
  readonly searchBoxStatus: InputStatus | undefined;
  /** The {@link Empathize} is open state. */
  readonly isEmpathizeOpen: boolean;
  /** The {@link NextQueriesXModule} next queries. */
  readonly nextQueries: ReadonlyArray<NextQuery>;
  /** The {@link SearchXModule} no results situation. */
  readonly noResults: boolean;
  /** The {@link SearchXModule} partial results. */
  readonly partialResults: ReadonlyArray<PartialResult>;
  /** The {@link PopularSearchesXModule} popular searches. */
  readonly popularSearches: ReadonlyArray<Suggestion>;
  /** The query value of the different modules. */
  readonly query: XComponentAliasQueryAPI;
  /** The {@link QuerySuggestionsXModule} query suggestions that should be displayed. */
  readonly querySuggestions: ReadonlyArray<Suggestion>;
  /** The {@link QuerySuggestionsXModule} query suggestions. */
  readonly fullQuerySuggestions: ReadonlyArray<Suggestion>;
  /** The {@link RecommendationsXModule} recommendations. */
  readonly recommendations: ReadonlyArray<Result>;
  /** The {@link SearchXModule} redirections. */
  readonly redirections: ReadonlyArray<Redirection>;
  /** The {@link RelatedTagsXModule} related tags (Both selected and deselected). */
  readonly relatedTags: ReadonlyArray<RelatedTag>;
  /** The {@link SearchXModule} search results. */
  readonly results: ReadonlyArray<Result>;
  /** The {@link ScrollXModule} data state. */
  readonly scroll: Record<string, ScrollComponentState>;
  /** The {@link FacetsXModule} selected filters. */
  readonly selectedFilters: Filter[];
  /** The {@link RelatedTagsXModule} selected related tags. */
  readonly selectedRelatedTags: ReadonlyArray<RelatedTag>;
  /** The {@link SemanticQueriesXModule} queries. */
  readonly semanticQueries: ReadonlyArray<SemanticQuery>;
  /** The {@link SearchXModule} spellchecked query. */
  readonly spellcheckedQuery: string | null;
  /** The status value of the different modules. */
  readonly status: XComponentAliasStatusAPI;
  /** The {@link SearchXModule} total results. */
  readonly totalResults: number;
  /** The {@link SearchXModule} selected sort. */
  readonly selectedSort: string;
}

/**
 * Alias to facilitate retrieving the modules with query.
 *
 * @public
 */
interface UseAliasQueryAPI {
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
interface UseAliasStatusAPI {
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
