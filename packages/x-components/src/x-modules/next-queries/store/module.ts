import { EmpathyAdapterBuilder } from '@empathy/search-adapter';
import { HistoryQuery } from '@empathy/search-types';
import { isArrayEmpty } from '../../../utils/array';
import { NextQueriesXStoreModule } from './types';

const adapter = new EmpathyAdapterBuilder()
  .setInstance('juguettos')
  .setLang('es')
  .setScope('x-components-development')
  .build(); // TODO It should be injected

/**
 * {@link XStoreModule} For the next-queries module.
 *
 * @internal
 */
export const nextQueriesXStoreModule: NextQueriesXStoreModule = {
  state: () => ({
    query: '',
    nextQueries: [],
    config: {
      maxItemsToRender: 5,
      hideSessionQueries: true,
      loadOnInit: false
    }
  }),
  getters: {
    request(state) {
      return state.query
        ? {
            query: state.query,
            rows: state.config.maxItemsToRender,
            start: 0
          }
        : null;
    }
  },
  mutations: {
    setQuery(state, newQuery) {
      state.query = newQuery;
    },
    setNextQueries(state, nextQueries) {
      state.nextQueries = nextQueries;
    }
  },
  actions: {
    getAndSaveNextQueries({ dispatch, commit }) {
      dispatch('getNextQueries').then(nextQueries => commit('setNextQueries', nextQueries));
    },
    getNextQueries({ getters }) {
      return getters.request
        ? adapter.getNextQueries(getters.request).then(({ nextQueries }) => nextQueries)
        : [];
    },
    setQueryFromLastHistoryQuery({ commit, state }, historyQueries: HistoryQuery[]) {
      if (!isArrayEmpty(historyQueries) && state.config.loadOnInit) {
        commit('setQuery', historyQueries[0].query);
      }
    }
  }
};
