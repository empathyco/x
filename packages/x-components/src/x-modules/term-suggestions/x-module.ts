// XModule
import { XModule } from '../x-modules.types';
import { termSuggestionsEmitters } from './store/emitters';
import { TermSuggestionsXStoreModule } from './store/types';
import { termSuggestionsXStoreModule } from './store/module';
import { termSuggestionsWiring } from './wiring';

/**
 * TermSuggestions {@link XModule} alias
 *
 * @public
 */
export type TermSuggestionsXModule = XModule<TermSuggestionsXStoreModule>;

/**
 * TermSuggestions {@link XModule} implementation. This module is auto-registered as soon as you import any component
 * from the `term-suggestions` entry point.
 *
 * @public
 */
export const termSuggestionsXModule: TermSuggestionsXModule = {
  name: 'termSuggestions',
  storeModule: termSuggestionsXStoreModule,
  storeEmitters: termSuggestionsEmitters,
  wiring: termSuggestionsWiring
};
