// XModule
import type { XModule } from '../x-modules.types'
import type { BrowseXStoreModule } from './store/types'
import { XPlugin } from '../../plugins/x-plugin'
import { browseEmitters } from './store/emitters'
import { browseXStoreModule } from './store/module'
import { browseWiring } from './wiring'

/**
 * Search {@link XModule} alias.
 *
 * @public
 */
export type BrowseXModule = XModule<BrowseXStoreModule>

/**
 * Search {@link XModule} implementation. This module is auto-registered as soon as you
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
