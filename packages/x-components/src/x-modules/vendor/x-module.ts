import type { XModule } from '../x-modules.types'
import type { VendorXStoreModule } from './store/types'
import { XPlugin } from '../../plugins/x-plugin'
import { vendorEmitters } from './store/emitters'
import { vendorXStoreModule } from './store/module'
import { vendorWiring } from './wiring'

/**
 * Vendor {@link XModule} alias.
 *
 * @public
 */
export type VendorXModule = XModule<VendorXStoreModule>

/**
 * Vendor {@link XModule} implementation. This module is auto-registered as soon as you
 * import any component from the `vendor` entry point.
 *
 * @public
 */
export const vendorXModule: VendorXModule = {
  name: 'vendor',
  storeModule: vendorXStoreModule,
  storeEmitters: vendorEmitters,
  wiring: vendorWiring,
}

XPlugin.registerXModule(vendorXModule)
