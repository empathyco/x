import { createStoreEmitters } from '../../../store'
import { vendorXStoreModule } from './module'

/**
 * {@link StoreEmitters} For the vendor module.
 *
 * @internal
 */
export const vendorEmitters = createStoreEmitters(vendorXStoreModule, {
  VendorQueryChanged: (_, getters) => getters.query,
})
