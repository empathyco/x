import type { XModule } from '../x-modules.types'
import type { PopularSearchesXStoreModule } from './store/types'
import { XPlugin } from '../../plugins/x-plugin'
import { popularSearchesEmitters } from './store/emitters'
import { popularSearchesXStoreModule } from './store/module'
import { popularSearchesWiring } from './wiring'

/**
 * PopularSearches {@link XModule} alias.
 *
 * @public
 */
export type PopularSearchesXModule = XModule<PopularSearchesXStoreModule>

/**
 * Popular searches {@link XModule} implementation. This module is auto-registered as soon as
 * you import any component from the `popular-searches` entry point.
 *
 * @public
 */
export const popularSearchesXModule: PopularSearchesXModule = {
  name: 'popularSearches',
  storeModule: popularSearchesXStoreModule,
  storeEmitters: popularSearchesEmitters,
  wiring: popularSearchesWiring,
}

XPlugin.registerXModule(popularSearchesXModule)
