import type { AnyXModule } from '../../../x-modules/x-modules.types'
import { defineXStore } from '../define-x-store'

export interface FixtureState {
  query: string
  params: Record<string, string>
  config: { section: string }
}

/**
 * Creates the initial state of the fictitious module used in the tests.
 *
 * @returns The initial state.
 */
export function createFixtureState(): FixtureState {
  return { query: '', params: {}, config: { section: 'section-a' } }
}

/**
 * Creates the Pinia store definition of the fictitious module used in the tests.
 *
 * @returns The Pinia store definition.
 */
export function createFixturePiniaStore() {
  return defineXStore('searchBox', {
    state: createFixtureState,
    getters: {
      upperQuery: state => state.query.toUpperCase(),
    },
    actions: {
      setQuery(query: string) {
        ;(this as FixtureState).query = query
      },
      async fetchSomething() {
        return Promise.resolve('done-1')
      },
    },
    bridge: { mutations: ['setQuery'], actions: ['fetchSomething'] },
  })
}

/**
 * Creates the fictitious module used in the tests. Its Vuex store module is equivalent to the
 * Pinia store definition.
 *
 * @param withPinia - Whether the module has a Pinia store or not.
 * @returns The module.
 */
export function createFixtureXModule(withPinia: boolean): AnyXModule {
  return {
    name: 'searchBox',
    wiring: {},
    storeEmitters: {
      SearchBoxQueryChanged: state => (state as FixtureState).query,
    },
    storeModule: {
      state: createFixtureState,
      getters: {
        upperQuery: (state: FixtureState) => state.query.toUpperCase(),
      },
      mutations: {
        setQuery(state: FixtureState, query: string) {
          state.query = query
        },
      },
      actions: {
        async fetchSomething() {
          return Promise.resolve('done-1')
        },
      },
    },
    ...(withPinia ? { piniaStore: createFixturePiniaStore() } : {}),
  } as AnyXModule
}
