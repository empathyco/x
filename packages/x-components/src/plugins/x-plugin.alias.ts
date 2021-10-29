import { Store } from 'vuex';
import { RootXStoreState } from '../store';
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
 * @param store - The store from which retrieve the data.
 * @returns An object containing the alias part of the {@link XComponentAPI}.
 * @internal
 */
export function getAliasAPI(
  store: Store<{ x: Partial<RootXStoreState['x']> }>
): XComponentAliasAPI {
  const queryModules = [
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
        return store.state.x[moduleName]?.query ?? '';
      },
      enumerable: true
    });
  }, {} as XComponentAliasQueryAPI);
  const status = statusModules.reduce((acc, moduleName) => {
    return Object.defineProperty(acc, moduleName, {
      get(): RequestStatus | undefined {
        return store.state.x[moduleName]?.status;
      },
      enumerable: true
    });
  }, {} as XComponentAliasStatusAPI);

  return {
    query,
    status,
    get device() {
      return store.state.x.device?.name ?? null;
    },
    get facets() {
      return store.getters[getGetterPath('facets', 'facets')] ?? {};
    },
    get historyQueries() {
      return store.getters[getGetterPath('historyQueries', 'historyQueries')] ?? [];
    },
    get identifierResults() {
      return store.state.x.identifierResults?.identifierResults ?? [];
    },
    get isEmpathizeOpen() {
      return store.state.x.empathize?.isOpen ?? false;
    },
    get nextQueries() {
      return store.getters[getGetterPath('nextQueries', 'nextQueries')] ?? [];
    },
    get noResults() {
      return !this.totalResults && !!this.query.search && this.status.search !== 'loading';
    },
    get partialResults() {
      return store.state.x.search?.partialResults ?? [];
    },
    get popularSearches() {
      return store.state.x.popularSearches?.popularSearches ?? [];
    },
    get querySuggestions() {
      return store.state.x.querySuggestions?.suggestions ?? [];
    },
    get recommendations() {
      return store.state.x.recommendations?.recommendations ?? [];
    },
    get redirections() {
      return store.state.x.search?.redirections ?? [];
    },
    get relatedTags() {
      return store.getters[getGetterPath('relatedTags', 'relatedTags')] ?? [];
    },
    get selectedFilters() {
      return store.getters[getGetterPath('facets', 'selectedFilters')] ?? [];
    },
    get selectedRelatedTags() {
      return store.state.x.relatedTags?.selectedRelatedTags ?? [];
    },
    get spellcheckedQuery() {
      return store.state.x.search?.spellcheckedQuery ?? null;
    },
    get totalResults() {
      return store.state.x.search?.totalResults ?? 0;
    }
  };
}
