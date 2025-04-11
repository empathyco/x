import type { XModule } from '../x-modules.types'
import type { FacetsXStoreModule } from './store/types'
import { XPlugin } from '../../plugins/x-plugin'
import { facetsEmitters } from './store/emitters'
import { facetsXStoreModule } from './store/module'
import { facetsWiring } from './wiring'

/**
 * Facets {@link XModule} alias.
 *
 * @public
 */
export type FacetsXModule = XModule<FacetsXStoreModule>

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
  wiring: facetsWiring,
}

XPlugin.registerXModule(facetsXModule)
