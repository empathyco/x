import type { FixtureState } from './pinia-test.utils'
import { createPinia } from 'pinia'
import { describe, expect, it } from 'vitest'
import { defineXStore, getXStoreGetterNames, useXStore } from '../define-x-store'
import { createFixturePiniaStore, createFixtureState } from './pinia-test.utils'

describe('defineXStore', () => {
  it('returns a descriptor without creating any store', () => {
    const pinia = createPinia()
    const definition = createFixturePiniaStore()

    expect(definition.id).toBe('x/searchBox')
    expect(definition.name).toBe('searchBox')
    expect(pinia.state.value).toEqual({})
  })

  it('creates the store in a pinia instance that is not installed in any app', () => {
    const pinia = createPinia()
    const store = useXStore(createFixturePiniaStore(), pinia)

    expect(store.$state).toEqual(createFixtureState())
    expect(pinia.state.value['x/searchBox']).toBe(store.$state)
  })

  it('applies the state override and the config', () => {
    const store = useXStore(createFixturePiniaStore(), createPinia(), {
      stateOverride: { query: 'query-1', params: { a: 'param-a' } },
      config: { section: 'section-b' },
    })

    expect(store.$state).toEqual({
      query: 'query-1',
      params: { a: 'param-a' },
      config: { section: 'section-b' },
    })
  })

  it('keeps the customization when the store is reset', () => {
    const store = useXStore(createFixturePiniaStore(), createPinia(), {
      stateOverride: { query: 'query-1' },
      config: { section: 'section-b' },
    })
    const state = store.$state as unknown as FixtureState
    state.config.section = 'section-c'
    state.query = 'query-2'

    store.$reset()

    expect(store.$state).toEqual({
      query: 'query-1',
      params: {},
      config: { section: 'section-b' },
    })
  })

  it('gives the state and the getters of the same store to the getters', () => {
    const definition = defineXStore('searchBox', {
      state: createFixtureState,
      getters: {
        upperQuery: state => state.query.toUpperCase(),
        shoutedQuery: (_state, getters) => `${getters.upperQuery as string}!`,
      },
    })
    const store = useXStore(definition, createPinia(), { stateOverride: { query: 'query-1' } })

    expect(store.shoutedQuery).toBe('QUERY-1!')
    expect(getXStoreGetterNames(definition)).toEqual(['upperQuery', 'shoutedQuery'])
  })

  it('normalizes the bridge names, allowing to rename them', () => {
    const definition = defineXStore('searchBox', {
      state: createFixtureState,
      bridge: { mutations: { setQueryAlias: 'setQuery' }, actions: ['fetchSomething'] },
    })

    expect(definition.bridge).toEqual({
      mutations: { setQueryAlias: 'setQuery' },
      actions: { fetchSomething: 'fetchSomething' },
    })
    expect(defineXStore('searchBox', { state: createFixtureState }).bridge).toEqual({
      mutations: {},
      actions: {},
    })
  })
})
