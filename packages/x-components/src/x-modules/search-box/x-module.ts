// XModule
import { XModule } from '../x-modules.types';
import { searchBoxWiring } from './wiring';
import { SearchBoxXStoreModule } from './store/types';
import { searchBoxEmitters } from './store/emitters';
import { searchBoxXStoreModule } from './store/module';

/**
 * SearchBox {@link XModule} alias.
 *
 * @public
 */
export type SearchBoxXModule = XModule<SearchBoxXStoreModule>;

/**
 * SearchBox {@link XModule} implementation. This module is auto-registered as soon as you
 * import any component from the `search-box` entry point.
 *
 * @public
 */
export const searchBoxXModule: SearchBoxXModule = {
  name: 'searchBox',
  storeModule: searchBoxXStoreModule,
  storeEmitters: searchBoxEmitters,
  wiring: searchBoxWiring
};
