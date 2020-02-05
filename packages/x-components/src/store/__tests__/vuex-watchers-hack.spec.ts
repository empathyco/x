import { createLocalVue } from '@vue/test-utils';
import Vuex, { Module, Store } from 'vuex';

/**
 * When dynamically registering modules, Vuex re-executes watchers, if the watcher is over a primitive value, it is stopped due to a simple
 * === comparison, but when it is over a complex object or array, the comparison fails, and it emits that the value has changed. Looks like
 * this behavior is intended. Vuex store is reset when registering a new module.
 * @link https://github.com/vuejs/vuex/issues/524#issuecomment-267715183
 */
interface StoreRootState {
  first: FirstState;
  second: SecondState;
}

interface FirstState {
  flag: boolean;
  object: {
    name: string;
  };
}

interface SecondState {
  count: number;
}

const firstModule: Module<FirstState, StoreRootState> = {
  namespaced: true,
  state: {
    flag: true,
    object: {
      name: 'Vue'
    }
  },
  getters: {
    notFlag(state) {
      return !state.flag;
    },
    objectCopy(state) {
      return { ...state.object };
    }
  },
  mutations: {
    toggleFlag(state: FirstState) {
      state.flag = !state.flag;
    },
    setName(state: FirstState, name: string) {
      state.object = { name };
    }
  }
};

const secondModule: Module<SecondState, StoreRootState> = {
  namespaced: true,
  state: {
    count: 0
  }
};

const localVue = createLocalVue();
localVue.use(Vuex);
let store: Store<StoreRootState>;
const watchCallback = jest.fn();
beforeEach(() => {
  jest.clearAllMocks();
});

describe('Vuex watchers standard behavior', () => {
  beforeEach(() => {
    store = new Store({});
  });

  it(
    'Does not trigger simple state watchers when registering modules',
    simpleValuesWatchers
  );

  it(
    'Does not trigger simple getter watchers when registering modules',
    simpleGettersWatchers
  );

  it(
    'Does not trigger object state watchers when registering modules',
    doesNotEagerExecuteStateWatchers
  );

  it(
    'Does not trigger object getter watchers when registering modules',
    doesNotEagerExecuteGettersWatchers
  );

  it('Triggers object state watchers when registering modules', async () => {
    expect.assertions(1);
    store.registerModule('first', firstModule);
    store.watch(state => state.first.object, watchCallback);
    store.registerModule('second', secondModule);

    await localVue.nextTick();
    expect(watchCallback).toHaveBeenCalledTimes(1); // But it should not be called
  });

  it('Triggers object getter watchers when registering modules', async () => {
    expect.assertions(1);
    store.registerModule('first', firstModule);
    store.watch((_, getters) => getters['first/objectCopy'], watchCallback);
    store.registerModule('second', secondModule);

    await localVue.nextTick();
    expect(watchCallback).toHaveBeenCalledTimes(1); // But it should not be called
  });
});

describe('Vuex watchers hack', () => {
  beforeEach(() => {
    store = new Store({
      state: {
        first: null as any, // `any` to prevent TS from complaining
        second: null as any
      }
    });
  });

  it(
    'Does not trigger simple state watchers when registering modules',
    simpleValuesWatchers
  );

  it(
    'Does not trigger simple getter watchers when registering modules',
    simpleGettersWatchers
  );

  it(
    'Does not trigger object state watchers when registering modules',
    doesNotEagerExecuteStateWatchers
  );

  it(
    'Does not trigger object getter watchers when registering modules',
    doesNotEagerExecuteGettersWatchers
  );

  it('Triggers object state watchers when registering modules', async () => {
    expect.assertions(1);
    store.registerModule('first', firstModule);
    store.watch(state => state.first.object, watchCallback);
    store.registerModule('second', secondModule);

    await localVue.nextTick();
    expect(watchCallback).not.toHaveBeenCalled();
  });

  it('Triggers object getter watchers when registering modules', async () => {
    expect.assertions(1);
    store.registerModule('first', firstModule);
    store.watch((_, getters) => getters['first/objectCopy'], watchCallback);
    store.registerModule('second', secondModule);

    await localVue.nextTick();
    expect(watchCallback).not.toHaveBeenCalled();
  });
});

async function simpleValuesWatchers() {
  expect.assertions(1);
  store.registerModule('first', firstModule);
  store.watch(state => state.first.flag, watchCallback);
  store.registerModule('second', secondModule);

  await localVue.nextTick();
  expect(watchCallback).not.toHaveBeenCalled();
}

async function simpleGettersWatchers() {
  expect.assertions(1);
  store.registerModule('first', firstModule);
  store.watch((_, getters) => getters['first/notFlag'], watchCallback);
  store.registerModule('second', secondModule);

  await localVue.nextTick();
  expect(watchCallback).not.toHaveBeenCalled();
}

async function doesNotEagerExecuteStateWatchers() {
  expect.assertions(1);
  store.registerModule('first', firstModule);
  store.watch(state => state.first.object, watchCallback);

  await localVue.nextTick();
  expect(watchCallback).not.toHaveBeenCalled();
}
async function doesNotEagerExecuteGettersWatchers() {
  expect.assertions(1);
  store.registerModule('first', firstModule);
  store.watch((_, getters) => getters['first/objectCopy'], watchCallback);

  await localVue.nextTick();
  expect(watchCallback).not.toHaveBeenCalled();
}
