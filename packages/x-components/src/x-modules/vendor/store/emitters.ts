import { createStoreEmitters } from '../../../store'
import type { VendorState } from './types'
import { vendorXStoreModule } from './module'

/**
 * {@link StoreEmitters} For the vendor module.
 *
 * @internal
 */
export const vendorEmitters = createStoreEmitters(vendorXStoreModule, {})
