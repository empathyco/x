import { XModule } from '../x-modules.types';
import { popularSearchesEmitters } from './store/emitters';
import { popularSearchesXStoreModule } from './store/module';
import { PopularSearchesXStoreModule } from './store/types';
import { popularSearchesWiring } from './wiring';

export type PopularSearchesXModule = XModule<PopularSearchesXStoreModule>;

export const popularSearchesXModule: PopularSearchesXModule = {
  name: 'popularSearches',
  storeModule: popularSearchesXStoreModule,
  storeEmitters: popularSearchesEmitters,
  wiring: popularSearchesWiring
};
