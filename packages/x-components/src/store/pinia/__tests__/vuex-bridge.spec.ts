import type { FixtureState } from './pinia-test.utils'
import { createPinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { nextTick, watch } from 'vue'
import { createStore, Store } from 'vuex'
import { useXStore } from '../define-x-store'
import { bridgePiniaModule, linkReplaceState } from '../vuex-bridge'
import { createFixturePiniaStore } from './pinia-test.utils'

function setUpBridge() {
  const store = createStore<any>({ modules: { x: { namespaced: true } } })
  const definition = createFixturePiniaStore()
  const piniaStore = useXStore(definition, createPinia())
  bridgePiniaModule(store, 'searchBox', piniaStore, definition.bridge, ['upperQuery'])
  const unlink = linkReplaceState(store, 'searchBox', piniaStore)
  return { store, piniaStore, unlink, state: piniaStore.$state as unknown as FixtureState }
}

describe('vuex bridge', () => {
  let bridge: ReturnType<typeof setUpBridge>

  beforeEach(() => {
    bridge = setUpBridge()
  })

  it('keeps the identity of the state, even after registering other modules', () => {
    const { store, piniaStore } = bridge
    expect(store.state.x.searchBox).toBe(piniaStore.$state)

    store.registerModule(['x', 'other'], { namespaced: true, state: () => ({}) })

    expect(store.state.x.searchBox).toBe(piniaStore.$state)
  })

  it('is reactive in both directions', async () => {
    const { store, piniaStore, state } = bridge
    const seenFromVuex: string[] = []
    watch(
      () => store.getters['x/searchBox/upperQuery'] as string,
      value => seenFromVuex.push(value),
    )

    state.query = 'query-1'
    await nextTick()
    ;(store.state.x.searchBox as FixtureState).query = 'query-2'
    await nextTick()

    expect(seenFromVuex).toEqual(['QUERY-1', 'QUERY-2'])
    expect(piniaStore.query).toBe('query-2')
  })

  it('delegates raw commits and dispatches to the pinia actions', async () => {
    const { store, state } = bridge

    store.commit('x/searchBox/setQuery', 'query-1')

    expect(state.query).toBe('query-1')
    await expect(store.dispatch('x/searchBox/fetchSomething')).resolves.toBe('done-1')
  })

  describe('replaceState', () => {
    it('keeps the identity when the whole module state is replaced', () => {
      const { store, piniaStore, state } = bridge

      store.replaceState({
        x: { searchBox: { query: 'query-1', params: {}, config: { section: 'section-a' } } },
      })
      store.commit('x/searchBox/setQuery', 'query-2')

      expect(piniaStore.query).toBe('query-2')
      expect(store.state.x.searchBox).toBe(piniaStore.$state)
      expect(store.state.x.searchBox.query).toBe('query-2')
      expect(state.query).toBe('query-2')
    })

    it('replaces nested objects instead of merging them', () => {
      const { store, piniaStore } = bridge
      store.commit('x/searchBox/setQuery', 'query-1')
      ;(piniaStore.$state as unknown as FixtureState).params = { b: 'param-b', c: 'param-c' }

      store.replaceState({ x: { searchBox: { params: { a: 'param-a' } } } })

      expect(piniaStore.params).toEqual({ a: 'param-a' })
      expect(piniaStore.query).toBe('')
    })

    it('links again the pinia state when the module is not in the new state', () => {
      const { store, piniaStore } = bridge
      store.commit('x/searchBox/setQuery', 'query-1')

      expect(() => {
        store.replaceState({ x: {} })
      }).not.toThrow()

      expect(store.state.x.searchBox).toBe(piniaStore.$state)
      expect(store.state.x.searchBox.query).toBe('query-1')
    })

    it('does not fail when the new state has no x module', () => {
      const { store } = bridge

      expect(() => {
        store.replaceState({})
      }).not.toThrow()
    })

    it('restores the original function when the last link is removed', () => {
      const { store, unlink } = bridge
      expect(store.replaceState).not.toBe(Store.prototype.replaceState)

      unlink()

      expect(store.replaceState).toBe(Store.prototype.replaceState)
    })
  })
})
