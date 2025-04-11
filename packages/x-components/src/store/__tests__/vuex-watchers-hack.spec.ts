import type { Module, Store } from 'vuex'
import { nextTick } from 'vue'
import { createStore } from 'vuex'

interface StoreRootState {
  first: FirstState
  second: SecondState
}

interface FirstState {
  flag: boolean
  object: {
    name: string
  }
}

interface SecondState {
  count: number
}

const firstModule: Module<FirstState, StoreRootState> = {
  namespaced: true,
  state: {
    flag: true,
    object: {
      name: 'Vue',
    },
  },
  getters: {
    notFlag(state) {
      return !state.flag
    },
    objectCopy(state) {
      return { ...state.object }
    },
  },
  mutations: {
    toggleFlag(state: FirstState) {
      state.flag = !state.flag
    },
    setName(state: FirstState, name: string) {
      state.object = { name }
    },
  },
}

const secondModule: Module<SecondState, StoreRootState> = {
  namespaced: true,
  state: {
    count: 0,
  },
}
let store: Store<StoreRootState>
store = createStore<StoreRootState>({})
const watchCallback = jest.fn()

describe('testing Vuex watcher hacks', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('vuex watchers standard behavior', () => {
    beforeEach(() => {
      store = createStore<StoreRootState>({})
    })

    it('does not trigger simple state watchers when registering modules', simpleValuesWatchers)

    it('does not trigger simple getter watchers when registering modules', simpleGettersWatchers)

    it(
      'does not trigger object state watchers when registering modules',
      doesNotEagerExecuteStateWatchers,
    )

    it(
      'does not trigger object getter watchers when registering modules',
      doesNotEagerExecuteGettersWatchers,
    )

    it('does not trigger object state watchers when registering other modules', async () => {
      expect.assertions(1)
      store.registerModule('first', firstModule)
      store.watch(state => state.first.object, watchCallback)
      store.registerModule('second', secondModule)

      await nextTick()
      expect(watchCallback).toHaveBeenCalledTimes(0)
    })

    it('does not trigger object getter watchers when registering new modules', async () => {
      expect.assertions(1)
      store.registerModule('first', firstModule)
      store.watch((_, getters) => getters['first/objectCopy'], watchCallback)
      store.registerModule('second', secondModule)

      await nextTick()
      expect(watchCallback).toHaveBeenCalledTimes(0)
    })
  })

  describe('vuex watchers hack', () => {
    beforeEach(() => {
      store = createStore({
        state: {
          first: null as any, // `any` to prevent TS from complaining
          second: null as any,
        },
      })
    })

    it('does not trigger simple state watchers when registering modules', simpleValuesWatchers)

    it('does not trigger simple getter watchers when registering modules', simpleGettersWatchers)

    it(
      'does not trigger object state watchers when registering modules',
      doesNotEagerExecuteStateWatchers,
    )

    it(
      'does not trigger object getter watchers when registering modules',
      doesNotEagerExecuteGettersWatchers,
    )

    it('triggers object state watchers when registering modules', async () => {
      expect.assertions(1)
      store.registerModule('first', firstModule)
      store.watch(state => state.first.object, watchCallback)
      store.registerModule('second', secondModule)

      await nextTick()
      expect(watchCallback).not.toHaveBeenCalled()
    })

    it('triggers object getter watchers when registering modules', async () => {
      expect.assertions(1)
      store.registerModule('first', firstModule)
      store.watch((_, getters) => getters['first/objectCopy'], watchCallback)
      store.registerModule('second', secondModule)

      await nextTick()
      expect(watchCallback).not.toHaveBeenCalled()
    })
  })

  async function simpleValuesWatchers(): Promise<void> {
    expect.assertions(1)
    store.registerModule('first', firstModule)
    store.watch(state => state.first.flag, watchCallback)
    store.registerModule('second', secondModule)

    await nextTick()
    expect(watchCallback).not.toHaveBeenCalled()
  }

  async function simpleGettersWatchers(): Promise<void> {
    expect.assertions(1)
    store.registerModule('first', firstModule)
    store.watch((_, getters) => getters['first/notFlag'], watchCallback)
    store.registerModule('second', secondModule)

    await nextTick()
    expect(watchCallback).not.toHaveBeenCalled()
  }

  async function doesNotEagerExecuteStateWatchers(): Promise<void> {
    expect.assertions(1)
    store.registerModule('first', firstModule)
    store.watch(state => state.first.object, watchCallback)

    await nextTick()
    expect(watchCallback).not.toHaveBeenCalled()
  }

  async function doesNotEagerExecuteGettersWatchers(): Promise<void> {
    expect.assertions(1)
    store.registerModule('first', firstModule)
    store.watch((_, getters) => getters['first/objectCopy'], watchCallback)

    await nextTick()
    expect(watchCallback).not.toHaveBeenCalled()
  }
})
