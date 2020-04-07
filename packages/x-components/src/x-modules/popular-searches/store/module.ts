import { EmpathyAdapterBuilder } from '@empathy/search-adapter';
import { Suggestion } from '@empathy/search-types';
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
    suggestions: [],
    config: {
      maxItemsToRender: 5,
      showExtraSuggestionWithoutFilter: false
    }
  }),
  getters: {
    request: state => ({
      rows: state.config.maxItemsToRender,
      start: 0
    })
  },
  mutations: {
    setSuggestions(state, suggestions: Suggestion[]): void {
      state.suggestions = suggestions;
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
