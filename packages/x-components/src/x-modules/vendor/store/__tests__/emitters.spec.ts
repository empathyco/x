import type { WireMetadata } from '../../../../wiring'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { Store } from 'vuex'
import { installNewXPlugin } from '../../../../__tests__/utils'
import { XPlugin } from '../../../../plugins/x-plugin'
import { vendorXModule } from '../../x-module'

/**
 * Installs the vendor module and subscribes a listener to the `VendorQueryChanged` event.
 *
 * @returns The listener and the store.
 */
function render() {
  const store = new Store({})
  mount(
    {},
    { global: { plugins: [installNewXPlugin({ store, initialXModules: [vendorXModule] })] } },
  )

  const listener = vi.fn()
  XPlugin.bus.on('VendorQueryChanged', true).subscribe(listener)

  return { listener, store }
}

describe('testing vendor module emitters', () => {
  it('emits `VendorQueryChanged` with the current query when the module is registered', () => {
    const { listener } = render()

    expect(listener).toHaveBeenCalledWith({
      eventPayload: '',
      metadata: expect.objectContaining<Partial<WireMetadata>>({ moduleName: 'vendor' }),
    })
  })

  it('emits `VendorQueryChanged` with the new query when the vendor query changes', async () => {
    const { listener, store } = render()

    store.commit('x/vendor/setQuery', 'shoes')
    await nextTick()

    expect(listener).toHaveBeenCalledTimes(2)
    expect(listener).toHaveBeenLastCalledWith({
      eventPayload: 'shoes',
      metadata: expect.objectContaining<Partial<WireMetadata>>({ moduleName: 'vendor' }),
    })
  })
})
