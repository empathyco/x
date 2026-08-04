import { createStoreEmitters } from '../../../store'
import { vendorXStoreModule } from './module'

/**
 * {@link StoreEmitters} For the vendor module.
 *
 * @internal
 */
export const vendorEmitters = createStoreEmitters(vendorXStoreModule, {
  VendorQueryChanged: {
    selector: (_, getters) => getters.query,
    /**
     * Emits the event on module registration with the current query, so the consumers can
     * fetch the vendor results and banners even when there is no query yet (e.g. the initial
     * query previews).
     *
     * @internal
     */
    immediate: true,
  },
})
