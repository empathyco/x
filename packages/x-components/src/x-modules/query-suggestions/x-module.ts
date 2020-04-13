// XModule
import { XModule } from '../x-modules.types';
import { querySuggestionsEmitters } from './store/emitters';
import { querySuggestionsXStoreModule } from './store/module';
import { QuerySuggestionsXStoreModule } from './store/types';
import { querySuggestionsWiring } from './wiring';

/**
 * QuerySuggestions {@link XModule} alias.
 *
 * @public
 */
export type QuerySuggestionsXModule = XModule<QuerySuggestionsXStoreModule>;

/**
 * QuerySuggestions {@link XModule} implementation. This module is auto-registered as soon as you
 * import any component from the `query-suggestions` entry point.
 *
 * @public
 */
export const querySuggestionsXModule: QuerySuggestionsXModule = {
  name: 'querySuggestions',
  storeModule: querySuggestionsXStoreModule,
  storeEmitters: querySuggestionsEmitters,
  wiring: querySuggestionsWiring
};
