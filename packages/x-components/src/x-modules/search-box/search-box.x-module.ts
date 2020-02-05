import { XModule } from '../x-modules.types';
import { ActionsDictionary, MutationsDictionary } from '../../store';
import { XStoreModule } from '../../store/store.types';
import { createStoreEmitters } from '../../store/store.utils';
import { commit } from '../../wiring/wires.factory';
import { createWiring } from '../../wiring/wiring.utils';

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

export type SearchBoxEmitters = typeof searchBoxEmitters;

// Wiring

const searchBoxWiring = createWiring({
  UserTyped: {
    setSearchBoxQuery: commit('x/searchBox/setQuery')
  }
});

type SearchBoxWiring = typeof searchBoxWiring;

// XModule
export type SearchBoxXModule = XModule<
  SearchBoxXStoreModule,
  SearchBoxEmitters,
  SearchBoxWiring
>;
