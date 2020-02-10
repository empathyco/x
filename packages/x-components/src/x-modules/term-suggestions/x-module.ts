// XModule
import { XModule } from '../x-modules.types';
import { termSuggestionsEmitters } from './store/emitters';
import { TermSuggestionsXStoreModule } from './store/types';
import { termSuggestionsXStoreModule } from './store/module';
import { termSuggestionsWiring } from './wiring';

export type TermSuggestionsXModule = XModule<TermSuggestionsXStoreModule>;

export const termSuggestionsXModule: TermSuggestionsXModule = {
  name: 'termSuggestions',
  storeModule: termSuggestionsXStoreModule,
  storeEmitters: termSuggestionsEmitters,
  wiring: termSuggestionsWiring
};
