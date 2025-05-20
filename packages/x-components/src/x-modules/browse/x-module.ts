import type { XModule } from '../x-modules.types'
import type { BrowseXStoreModule } from './store/types'
import { XPlugin } from '../../plugins/index'
import { browseEmitters } from './store/emitters'
import { browseXStoreModule } from './store/module'
import { browseWiring } from './wiring'

/**
 * Browse {@link XModule} alias.
 *
 * @public
 */
export type BrowseXModule = XModule<BrowseXStoreModule>

/**
 * Browse {@link XModule} implementation. This module is auto-registered as soon as you
 * import any component from the `browse` entry point.
 *
 * @public
 */
export const browseXModule: BrowseXModule = {
  name: 'browse',
  storeModule: browseXStoreModule,
  storeEmitters: browseEmitters,
  wiring: browseWiring,
}

XPlugin.registerXModule(browseXModule)
