import { createLocalVue } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { XPlugin } from '../../../../plugins/x-plugin';
import { map } from '../../../../utils';
import { getSuggestionsStub } from '../../../../__stubs__/suggestions-stubs.factory';
import { getMockedAdapter } from '../../../../__tests__/utils';
import { popularSearchesXStoreModule } from '../module';
import { PopularSearchesState } from '../types';

describe('testing popular searches module actions', () => {
  const mockedSuggestions = getSuggestionsStub('PopularSearch');

  const adapter = getMockedAdapter({ suggestions: { suggestions: mockedSuggestions } });

  const actionKeys = map(popularSearchesXStoreModule.actions, action => action);
  const localVue = createLocalVue();
  localVue.config.productionTip = false; // Silent production console messages.
  localVue.use(Vuex);

  let store: Store<PopularSearchesState> = new Store(popularSearchesXStoreModule as any);
  localVue.use(XPlugin, { adapter, store });

  describe(`${actionKeys.getSuggestions}`, () => {
    it('should return suggestions', async () => {
      const suggestions = await store.dispatch(actionKeys.getSuggestions);
      expect(suggestions).toEqual(mockedSuggestions);
    });
  });

  describe(`${actionKeys.getAndSaveSuggestions}`, () => {
    it('should request and store suggestions in the state', async () => {
      await store.dispatch(actionKeys.getAndSaveSuggestions);
      expect(store.state.popularSearches).toEqual(mockedSuggestions);
    });
  });
});
