import Vue from 'vue';
import { RequestStatus } from '../store/utils/status-store.utils';
import {
  XComponentAliasAPI,
  XComponentAliasQueryAPI,
  XComponentAliasStatusAPI
} from './x-plugin.types';
import { getGetterPath } from './x-plugin.utils';

/**
 * Creates an object containing the alias part of {@link XComponentAPI}.
 *
 * @param component - The component with the store from which retrieve the data.
 * @returns An object containing the alias part of the {@link XComponentAPI}.
 *
 * @internal
 */
export function getAliasAPI(component: Vue): XComponentAliasAPI {
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

  const query = queryModules.reduce((acc, moduleName) => {
    return Object.defineProperty(acc, moduleName, {
      get(): string {
        return component.$store.state.x[moduleName]?.query ?? '';
      },
      enumerable: true
    });
  }, {} as XComponentAliasQueryAPI);
  const status = statusModules.reduce((acc, moduleName) => {
    return Object.defineProperty(acc, moduleName, {
      get(): RequestStatus | undefined {
        return component.$store.state.x[moduleName]?.status;
      },
      enumerable: true
    });
  }, {} as XComponentAliasStatusAPI);

  return {
    query,
    status,
    get device() {
      return component.$store.state.x.device?.name ?? null;
    },
    get facets() {
      return component.$store.getters[getGetterPath('facets', 'facets')] ?? {};
    },
    get historyQueries() {
      return component.$store.getters[getGetterPath('historyQueries', 'historyQueries')] ?? [];
    },
    get fullHistoryQueries() {
      return component.$store.state.x.historyQueries?.historyQueries ?? [];
    },
    get identifierResults() {
      return component.$store.state.x.identifierResults?.identifierResults ?? [];
    },
    get isEmpathizeOpen() {
      return component.$store.state.x.empathize?.isOpen ?? false;
    },
    get nextQueries() {
      return component.$store.getters[getGetterPath('nextQueries', 'nextQueries')] ?? [];
    },
    get noResults() {
      return !this.totalResults && !!this.query.search && this.status.search === 'success';
    },
    get partialResults() {
      return component.$store.state.x.search?.partialResults ?? [];
    },
    get popularSearches() {
      return component.$store.state.x.popularSearches?.popularSearches ?? [];
    },
    get querySuggestions() {
      return component.$store.state.x.querySuggestions?.suggestions ?? [];
    },
    get recommendations() {
      return component.$store.state.x.recommendations?.recommendations ?? [];
    },
    get redirections() {
      return component.$store.state.x.search?.redirections ?? [];
    },
    get relatedTags() {
      return component.$store.getters[getGetterPath('relatedTags', 'relatedTags')] ?? [];
    },
    get results() {
      return component.$store.state.x.search?.results ?? [];
    },
    get scroll() {
      return component.$store.state.x.scroll?.data ?? {};
    },
    get selectedFilters() {
      return component.$store.getters[getGetterPath('facets', 'selectedFilters')] ?? [];
    },
    get selectedRelatedTags() {
      return component.$store.state.x.relatedTags?.selectedRelatedTags ?? [];
    },
    get spellcheckedQuery() {
      return component.$store.state.x.search?.spellcheckedQuery ?? null;
    },
    get totalResults() {
      return component.$store.state.x.search?.totalResults ?? 0;
    },
    get selectedSort() {
      return component.$store.state.x.search?.sort ?? '';
    }
  };
}
