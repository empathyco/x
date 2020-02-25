import { SuggestionsRequest } from '@empathy/search-adapter';
import { Suggestion } from '@empathy/search-types';
import { XStoreModule } from '../../../store';
import { PopularSearchesConfig } from '../config.types';

export interface PopularSearchesState {
  suggestions: Suggestion[];
  config: PopularSearchesConfig;
}

export interface PopularSearchesGetters {
  request: SuggestionsRequest;
}

export interface PopularSearchesMutations {
  setSuggestions(suggestions: Suggestion[]): void;
}

export interface PopularSearchesActions {
  getSuggestions(): Promise<Suggestion[]>;
  retrieveSuggestions(): void;
}

export type PopularSearchesXStoreModule = XStoreModule<
  PopularSearchesState,
  PopularSearchesGetters,
  PopularSearchesMutations,
  PopularSearchesActions
>;
