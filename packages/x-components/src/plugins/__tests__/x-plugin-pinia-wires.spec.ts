import type { AnyWire } from '../../wiring/wiring.types'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { installNewXPlugin } from '../../__tests__/utils'
import { createFixtureXModule } from '../../store/pinia/__tests__/pinia-test.utils'
import {
  wireCommit,
  wireCommitWithoutPayload,
  wireDispatch,
  wireDispatchWithoutPayload,
} from '../../wiring/wires.factory'
import { XPlugin } from '../x-plugin'

type Backend = 'vuex' | 'pinia'

function install(backend: Backend, wire: AnyWire) {
  const xModule = createFixtureXModule(backend === 'pinia')
  xModule.wiring = { UserIsTypingAQuery: { testWire: wire } }
  mount(
    { template: '<div/>' },
    { global: { plugins: [installNewXPlugin({ initialXModules: [xModule] })] } },
  )
}

async function emitEvent(payload = 'query-1'): Promise<void> {
  await XPlugin.bus.emit('UserIsTypingAQuery', payload)
  await nextTick()
}

const getQuery = () => (XPlugin.store.state.x.searchBox as { query?: string }).query

describe.each<Backend>(['vuex', 'pinia'])('wires with the %s backend', backend => {
  afterEach(() => {
    XPlugin.resetInstance()
  })

  it('commits the payload of the event', async () => {
    install(backend, wireCommit('x/searchBox/setQuery'))

    await emitEvent('query-2')

    expect(getQuery()).toBe('query-2')
  })

  it('commits a static payload', async () => {
    install(backend, wireCommit('x/searchBox/setQuery', 'static-1'))

    await emitEvent()

    expect(getQuery()).toBe('static-1')
  })

  it('commits the payload returned by a payload factory that reads the store', async () => {
    install(
      backend,
      wireCommit(
        'x/searchBox/setQuery',
        ({ state, getters }: { state: any; getters: any }) =>
          `${state.x.searchBox.query as string}|${getters['x/searchBox/upperQuery'] as string}`,
      ),
    )
    XPlugin.store.commit('x/searchBox/setQuery', 'query-1')

    await emitEvent()

    expect(getQuery()).toBe('query-1|QUERY-1')
  })

  it('commits without payload', async () => {
    install(backend, wireCommitWithoutPayload('x/searchBox/setQuery'))
    XPlugin.store.commit('x/searchBox/setQuery', 'query-1')

    await emitEvent()

    expect(getQuery()).toBeUndefined()
  })

  it('dispatches with a payload factory and with a static payload', async () => {
    install(
      backend,
      wireDispatch('x/searchBox/fetchSomething', () => 'payload-1'),
    )

    await emitEvent()

    expect(getQuery()).toBe('fetched')
  })

  it('dispatches without payload', async () => {
    install(backend, wireDispatchWithoutPayload('x/searchBox/fetchSomething'))

    await emitEvent()

    expect(getQuery()).toBe('fetched')
  })
})
