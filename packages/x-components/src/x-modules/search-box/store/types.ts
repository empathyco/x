import { ActionsDictionary, MutationsDictionary, XStoreModule } from '../../../store';

export interface SearchBoxState {
  query: string;
}

export interface SearchBoxGetters {
  trimmedQuery: string;
}

export interface SearchBoxMutations extends MutationsDictionary {
  setQuery(newQuery: string): void;
}

export interface SearchBoxActions extends ActionsDictionary {}

export type SearchBoxXStoreModule = XStoreModule<
  SearchBoxState,
  SearchBoxGetters,
  SearchBoxMutations,
  SearchBoxActions
>;
