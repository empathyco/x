import { XStoreModule } from '../../../store';

export interface SearchBoxState {
  query: string;
}

export interface SearchBoxGetters {
  trimmedQuery: string;
}

export interface SearchBoxMutations {
  setQuery(newQuery: string): void;
}

export interface SearchBoxActions {}

export type SearchBoxXStoreModule = XStoreModule<
  SearchBoxState,
  SearchBoxGetters,
  SearchBoxMutations,
  SearchBoxActions
>;
