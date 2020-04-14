import { EmpathyAdapterBuilder } from '@empathy/search-adapter';
import { Suggestion } from '@empathy/search-types';
import { request } from './getters/request';
import { PopularSearchesXStoreModule } from './types';

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
export const popularSearchesXStoreModule: PopularSearchesXStoreModule = {
  state: () => ({
    popularSearches: [],
    config: {
      maxItemsToRender: 5,
      showExtraSuggestionWithoutFilter: false
    }
  }),
  getters: {
    request
  },
  mutations: {
    setSuggestions(state, suggestions: Suggestion[]): void {
      state.popularSearches = suggestions;
    }
  },
  actions: {
    getSuggestions({ getters: { request } }): Promise<Suggestion[]> {
      return adapter.getSuggestions(request).then(({ suggestions }) => suggestions);
    },
    retrieveSuggestions({ dispatch, commit }): void {
      dispatch('getSuggestions').then(suggestions => commit('setSuggestions', suggestions));
    }
  }
};
