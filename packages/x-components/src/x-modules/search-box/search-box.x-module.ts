import { ActionsDictionary, MutationsDictionary } from '../../store';
import { XStoreModule } from '../../store/store.types';
import { createStoreEmitters } from '../../store/store.utils';
import { withModule } from '../../wiring/wires.factory';
import { createWiring } from '../../wiring/wiring.utils';
import { XModule } from '../x-modules.types';

/**
 *  This is an example file of all the code needed to create a module
 *  TODO Remove it when real search-box is created
 */

// XStoreModule code

interface SearchBoxState {
  query: string;
}

interface SearchBoxGetters {
  safeQuery: string;
}

interface SearchBoxMutations extends MutationsDictionary {
  clearQuery(newQuery: string): void;
  setQuery(newQuery: string): void;
}

interface SearchBoxActions extends ActionsDictionary {
  someAsyncExampleFunction(): Promise<string>;
  someExampleFunction(doThings: boolean): number;
}

type SearchBoxXStoreModule = XStoreModule<
  SearchBoxState,
  SearchBoxGetters,
  SearchBoxMutations,
  SearchBoxActions
>;

const searchBoxXStoreModule: SearchBoxXStoreModule = {
  state: () => ({ query: '' }),
  getters: {
    safeQuery(state) {
      return state.query.trim();
    }
  },
  mutations: {
    setQuery(state, newQuery) {
      state.query = newQuery;
    },
    clearQuery(state) {
      state.query = '';
    }
  },
  actions: {
    someAsyncExampleFunction() {
      return Promise.resolve('');
    },
    someExampleFunction(context, doThings) {
      return doThings ? 1 : Promise.resolve(0);
    }
  }
};

// StoreEmitters

const searchBoxEmitters = createStoreEmitters(searchBoxXStoreModule, {
  SearchBoxQueryChanged: state => state.query
});

// Wiring

const searchBoxWiring = createWiring({
  UserTyped: {
    setSearchBoxQuery: withModule(`searchBox`).wireCommit('setQuery')
  }
});

// XModule
export type SearchBoxXModule = XModule<SearchBoxXStoreModule>;
