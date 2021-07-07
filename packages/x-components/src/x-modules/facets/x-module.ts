import { XModule } from '../x-modules.types';
import { facetsEmitters } from './store/emitters';
import { facetsXStoreModule } from './store/module';
import { FacetsXStoreModule } from './store/types';
import { facetsWiring } from './wiring';

/**
 * Facets {@link XModule} alias.
 *
 * @public
 */
export type FacetsXModule = XModule<FacetsXStoreModule>;

/**
 * Facets {@link XModule} implementation. This module is auto-registered as soon as you
 * import any component from the `facets` entry point.
 *
 * @public
 */
export const facetsXModule: FacetsXModule = {
  name: 'facets',
  storeModule: facetsXStoreModule,
  storeEmitters: facetsEmitters,
  wiring: facetsWiring
};
