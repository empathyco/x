import { XModule } from '../x-modules.types';
import { facetsNextEmitters } from './store/emitters';
import { facetsNextXStoreModule } from './store/module';
import { FacetsNextXStoreModule } from './store/types';
import { facetsNextWiring } from './wiring';

/**
 * Facets {@link XModule} alias.
 *
 * @public
 */
export type FacetsNextXModule = XModule<FacetsNextXStoreModule>;

/**
 * Facets {@link XModule} implementation. This module is auto-registered as soon as you
 * import any component from the `facets` entry point.
 *
 * @public
 */
export const facetsNextXModule: FacetsNextXModule = {
  name: 'facetsNext',
  storeModule: facetsNextXStoreModule,
  storeEmitters: facetsNextEmitters,
  wiring: facetsNextWiring
};
