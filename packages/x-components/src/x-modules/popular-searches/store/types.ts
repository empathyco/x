import { SuggestionsRequest } from '@empathy/search-adapter';
import { Suggestion } from '@empathy/search-types';
import { ActionsDictionary, MutationsDictionary, XStoreModule } from '../../../store';
import { PopularSearchesConfig } from '../config.types';

export interface PopularSearchesState {
  suggestions: Suggestion[];
  config: PopularSearchesConfig;
}

export interface PopularSearchesGetters {
  request: SuggestionsRequest;
}

export interface PopularSearchesMutations extends MutationsDictionary {
  setSuggestions(suggestions: Suggestion[]): void;
}

export interface PopularSearchesActions extends ActionsDictionary {
  getSuggestions(): Promise<Suggestion[]>;
  retrieveSuggestions(): void;
}

export type PopularSearchesXStoreModule = XStoreModule<
  PopularSearchesState,
  PopularSearchesGetters,
  PopularSearchesMutations,
  PopularSearchesActions
>;
