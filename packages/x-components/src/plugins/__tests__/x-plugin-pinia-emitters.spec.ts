import type { FixtureState } from '../../store/pinia/__tests__/pinia-test.utils'
import type { StoreEmitters } from '../../store/utils/store-emitters.utils'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { effectScope, nextTick } from 'vue'
import { XDummyBus } from '../../__tests__/bus.dummy'
import { installNewXPlugin } from '../../__tests__/utils'
import { createFixtureXModule } from '../../store/pinia/__tests__/pinia-test.utils'
import { XPlugin } from '../x-plugin'

type Backend = 'vuex' | 'pinia'

const setQuery = (query: string) => {
  XPlugin.store.commit('x/searchBox/setQuery', query)
}

/**
 * Installs the plugin with a fictitious module, and subscribes to its emitted events.
 *
 * @param backend - The store backend of the module.
 * @param storeEmitters - The store emitters of the module.
 * @param customizeModule - Optional function to customize the module before installing it.
 * @returns The subscriber of the `SearchBoxQueryChanged` event.
 */
function install(
  backend: Backend,
  storeEmitters: StoreEmitters<any>,
  customizeModule?: (xModule: ReturnType<typeof createFixtureXModule>) => void,
) {
  const bus = new XDummyBus()
  const subscriber = vi.fn()
  bus.on('SearchBoxQueryChanged', true).subscribe(subscriber)
  const xModule = createFixtureXModule(backend === 'pinia')
  xModule.storeEmitters = storeEmitters
  customizeModule?.(xModule)
  mount(
    { template: '<div/>' },
    { global: { plugins: [installNewXPlugin({ initialXModules: [xModule] }, bus)] } },
  )
  return subscriber
}

async function waitNextTick(): Promise<void> {
  await nextTick()
  vi.runAllTimers()
}

describe.each<Backend>(['vuex', 'pinia'])('store emitters with the %s backend', backend => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    XPlugin.resetInstance()
  })

  it('emits when registering only if the emitter is immediate', async () => {
    const immediate = install(backend, {
      SearchBoxQueryChanged: { selector: (state: FixtureState) => state.query, immediate: true },
    })
    await waitNextTick()
    expect(immediate).toHaveBeenCalledTimes(1)
    expect(immediate.mock.calls[0][0].metadata.oldValue).toBeUndefined()

    const notImmediate = install(backend, {
      SearchBoxQueryChanged: (state: FixtureState) => state.query,
    })
    await waitNextTick()
    expect(notImmediate).not.toHaveBeenCalled()
  })

  it('emits only when the filter allows it', async () => {
    const subscriber = install(backend, {
      SearchBoxQueryChanged: {
        selector: (state: FixtureState) => state.query,
        filter: (newValue: string) => newValue !== 'query-1',
      },
    })

    setQuery('query-1')
    await waitNextTick()
    setQuery('query-2')
    await waitNextTick()

    expect(subscriber).toHaveBeenCalledTimes(1)
    expect(subscriber.mock.calls[0][0].eventPayload).toBe('query-2')
  })

  it('merges the custom metadata with the default one', async () => {
    const subscriber = install(backend, {
      SearchBoxQueryChanged: {
        selector: (state: FixtureState) => state.query,
        metadata: { priority: 1 },
      },
    })

    setQuery('query-1')
    await waitNextTick()

    expect(subscriber.mock.calls[0][0].metadata).toEqual({
      priority: 1,
      moduleName: 'searchBox',
      oldValue: '',
    })
  })

  it('emits once for synchronous changes, and nothing if the value returns to the original', async () => {
    const subscriber = install(backend, {
      SearchBoxQueryChanged: (state: FixtureState) => state.query,
    })

    setQuery('query-1')
    setQuery('query-2')
    setQuery('query-3')
    await waitNextTick()
    expect(subscriber).toHaveBeenCalledTimes(1)
    expect(subscriber.mock.calls[0][0].eventPayload).toBe('query-3')

    setQuery('query-4')
    setQuery('query-3')
    await waitNextTick()
    expect(subscriber).toHaveBeenCalledTimes(1)
  })

  it('detects deep changes only when the emitter is deep', async () => {
    const deepSubscriber = install(backend, {
      SearchBoxQueryChanged: {
        selector: (state: FixtureState) => state.params as any,
        deep: true,
      },
    })

    ;(XPlugin.store.state.x.searchBox as unknown as FixtureState).params.a = 'param-a'
    await waitNextTick()

    expect(deepSubscriber).toHaveBeenCalledTimes(1)
  })

  it('stops emitting when the scope where it was registered is stopped', async () => {
    const scope = effectScope()
    const subscriber = scope.run(() =>
      install(backend, { SearchBoxQueryChanged: (state: FixtureState) => state.query }),
    )!

    scope.stop()
    setQuery('query-1')
    await waitNextTick()

    expect(subscriber).not.toHaveBeenCalled()
  })
})

describe('store emitters with the pinia backend', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    XPlugin.resetInstance()
  })

  it('uses the getters of the plugin that is installed after resetting the previous one', async () => {
    const oldSubscriber = install('pinia', {
      SearchBoxQueryChanged: (_state: FixtureState, getters: any) => getters.upperQuery,
    })
    const oldStore = XPlugin.store

    const newSubscriber = install(
      'pinia',
      { SearchBoxQueryChanged: (_state: FixtureState, getters: any) => getters.lowerQuery },
      xModule => {
        xModule.piniaStore!.getterNames = ['lowerQuery']
        xModule.piniaStore!.getters = {
          lowerQuery: (state: FixtureState) => state.query.toLowerCase(),
        }
      },
    )
    oldStore.commit('x/searchBox/setQuery', 'query-OLD')
    setQuery('QUERY-NEW')
    await waitNextTick()

    expect(oldSubscriber).not.toHaveBeenCalled()
    expect(newSubscriber).toHaveBeenCalledTimes(1)
    expect(newSubscriber.mock.calls[0][0].eventPayload).toBe('query-new')
  })

  it('gives the selectors only the getters of the pinia store', async () => {
    const selector = vi.fn((state: FixtureState, _getters: Record<string, unknown>) => state.query)
    install('pinia', { SearchBoxQueryChanged: selector })

    expect(Object.keys(selector.mock.calls[0][1])).toEqual(['upperQuery'])
  })
})
