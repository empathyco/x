import type { Store } from 'vuex'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createStore } from 'vuex'
import {
  clearStoreRoutes,
  getPiniaExecutor,
  getStoreBackend,
  setPiniaStoreRoute,
} from '../store-router'

describe('store router', () => {
  let store: Store<any>
  const setQuery = vi.fn()
  const fetchSomething = vi.fn(() => 'done-1')
  const route = {
    store: { setQuery, fetchSomething },
    mutations: { setQueryAlias: 'setQuery' },
    actions: { fetchSomething: 'fetchSomething' },
  }

  beforeEach(() => {
    store = createStore({})
    setQuery.mockClear()
    fetchSomething.mockClear()
  })

  it('has no executors and uses the vuex backend when there are no routes', () => {
    expect(getPiniaExecutor(store, 'commit', 'x/searchBox/setQuery')).toBeUndefined()
    expect(getStoreBackend(store, 'searchBox')).toBe('vuex')
  })

  it('executes the pinia action for commits, renaming it and returning nothing', () => {
    setPiniaStoreRoute(store, 'searchBox', route)

    const result = getPiniaExecutor(store, 'commit', 'x/searchBox/setQueryAlias')?.('query-1')

    expect(setQuery).toHaveBeenCalledWith('query-1')
    expect(result).toBeUndefined()
    expect(getStoreBackend(store, 'searchBox')).toBe('pinia')
  })

  it('executes the pinia action for dispatches, returning a promise', async () => {
    setPiniaStoreRoute(store, 'searchBox', route)

    const result = getPiniaExecutor(store, 'dispatch', 'x/searchBox/fetchSomething')?.()

    expect(result).toBeInstanceOf(Promise)
    await expect(result).resolves.toBe('done-1')
  })

  it('falls back to vuex for names that are not in the map or other modules', () => {
    setPiniaStoreRoute(store, 'searchBox', route)

    expect(getPiniaExecutor(store, 'commit', 'x/searchBox/setQuery')).toBeUndefined()
    expect(getPiniaExecutor(store, 'dispatch', 'x/searchBox/setQueryAlias')).toBeUndefined()
    expect(getPiniaExecutor(store, 'commit', 'x/search/setQueryAlias')).toBeUndefined()
    expect(getPiniaExecutor(store, 'commit', 'other/searchBox/setQueryAlias')).toBeUndefined()
  })

  it('does not affect other stores', () => {
    setPiniaStoreRoute(store, 'searchBox', route)
    const otherStore = createStore({})

    expect(getPiniaExecutor(otherStore, 'commit', 'x/searchBox/setQueryAlias')).toBeUndefined()
    expect(getStoreBackend(otherStore, 'searchBox')).toBe('vuex')
  })

  it('removes the routes of a store', () => {
    setPiniaStoreRoute(store, 'searchBox', route)

    clearStoreRoutes(store)

    expect(getPiniaExecutor(store, 'commit', 'x/searchBox/setQueryAlias')).toBeUndefined()
    expect(getStoreBackend(store, 'searchBox')).toBe('vuex')
  })

  it('propagates synchronously the errors of the dispatched actions', () => {
    setPiniaStoreRoute(store, 'searchBox', {
      ...route,
      store: {
        fetchSomething: () => {
          throw new Error('error-1')
        },
      },
    })

    expect(() => getPiniaExecutor(store, 'dispatch', 'x/searchBox/fetchSomething')?.()).toThrow(
      'error-1',
    )
  })
})
