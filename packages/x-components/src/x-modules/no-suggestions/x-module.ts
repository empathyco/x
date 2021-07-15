import { XModule } from '../x-modules.types';
import { noSuggestionsXStoreModule } from './store/module';
import { NoSuggestionsXStoreModule } from './store/types';
import { noSuggestionsWiring } from './wiring';

/**
 * NoSuggestions {@link XModule} alias.
 *
 * @public
 */
export type NoSuggestionsXModule = XModule<NoSuggestionsXStoreModule>;

/**
 * NoSuggestions {@link XModule} implementation. This module is auto-registered as soon as you
 * import any component from the `no-suggestions` entry point.
 *
 * @public
 */
export const noSuggestionsXModule: NoSuggestionsXModule = {
  name: 'noSuggestions',
  storeModule: noSuggestionsXStoreModule,
  storeEmitters: {},
  wiring: noSuggestionsWiring
};
