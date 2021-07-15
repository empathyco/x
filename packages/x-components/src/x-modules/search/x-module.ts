// XModule
import { XModule } from '../x-modules.types';
import { searchEmitters } from './store/emitters';
import { searchXStoreModule } from './store/module';
import { SearchXStoreModule } from './store/types';
import { searchWiring } from './wiring';

/**
 * Search {@link XModule} alias.
 *
 * @public
 */
export type SearchXModule = XModule<SearchXStoreModule>;

/**
 * Search {@link XModule} implementation. This module is auto-registered as soon as you
 * import any component from the `search` entry point.
 *
 * @public
 */
export const searchXModule: SearchXModule = {
  name: 'search',
  storeModule: searchXStoreModule,
  storeEmitters: searchEmitters,
  wiring: searchWiring
};
