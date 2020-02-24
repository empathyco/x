import { SuggestionsRequest } from '@empathy/search-adapter';
import { Suggestion } from '@empathy/search-types';
import { ActionsDictionary, MutationsDictionary, XStoreModule } from '../../../store';
import { TermSuggestionsConfig } from '../config.types';

export interface TermSuggestionsState {
  query: string;
  suggestions: Suggestion[];
  config: TermSuggestionsConfig;
}

export interface TermSuggestionsGetters {
  request: SuggestionsRequest | null;
}

export interface TermSuggestionsMutations extends MutationsDictionary {
  setQuery(newQuery: string): void;
  setSuggestions(suggestions: Suggestion[]): void;
}

export interface TermSuggestionsActions extends ActionsDictionary {
  getSuggestions(): Suggestion[];
  retrieveSuggestions(): void;
}

export type TermSuggestionsXStoreModule = XStoreModule<
  TermSuggestionsState,
  TermSuggestionsGetters,
  TermSuggestionsMutations,
  TermSuggestionsActions
>;
