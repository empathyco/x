// XModule
import { XModule } from '../x-modules.types';
import { searchBoxWiring } from './wiring';
import { SearchBoxXStoreModule } from './store/types';
import { searchBoxEmitters } from './store/emitters';
import { searchBoxXStoreModule } from './store/module';

export type SearchBoxXModule = XModule<SearchBoxXStoreModule>;

export const searchBoxXModule: SearchBoxXModule = {
  name: 'searchBox',
  storeModule: searchBoxXStoreModule,
  storeEmitters: searchBoxEmitters,
  wiring: searchBoxWiring
};
