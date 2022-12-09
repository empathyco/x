import { createLocalVue } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { installNewXPlugin } from '../../../../__tests__/utils';
import { searchBoxXStoreModule } from '../module';
import { SafeStore } from '../../../../store/__tests__/utils';
import { SearchBoxActions, SearchBoxGetters, SearchBoxMutations, SearchBoxState } from '../types';
import { UrlParams } from '../../../../types/url-params';
import { resetSearchBoxStateWith } from './utils';

describe('testing search box module actions', () => {
  const localVue = createLocalVue();

  localVue.config.productionTip = false; // Silent production console messages.
  localVue.use(Vuex);

  const store: SafeStore<SearchBoxState, SearchBoxGetters, SearchBoxMutations, SearchBoxActions> =
    new Store(searchBoxXStoreModule as any);

  installNewXPlugin({ store }, localVue);

  beforeEach(() => {
    resetSearchBoxStateWith(store);
  });

  describe('setUrlParams', () => {
    it('should set the query of the search box module', async () => {
      resetSearchBoxStateWith(store, { query: 'funko' });

      await store.dispatch('setUrlParams', { query: 'lego' } as UrlParams);

      expect(store.state.query).toEqual('lego');
    });

    it('should set the query even if empty of the search box module', async () => {
      resetSearchBoxStateWith(store, { query: 'funko' });

      await store.dispatch('setUrlParams', { query: '' } as UrlParams);

      expect(store.state.query).toEqual('');
    });
  });

  describe('setInputStatus', () => {
    it('should update the input status if the event emitted is valid', async () => {
      await store.dispatch('setInputStatus', 'UserIsTypingAQuery');
      expect(store.state.inputStatus).toEqual('typing');
      await store.dispatch('setInputStatus', 'UserAcceptedAQuery');
      expect(store.state.inputStatus).toEqual('filled');
      await store.dispatch('setInputStatus', 'UserFocusedSearchBox');
      expect(store.state.inputStatus).toEqual('focused');
      await store.dispatch('setInputStatus', 'UserClearedQuery');
      expect(store.state.inputStatus).toEqual('empty');
      await store.dispatch('setInputStatus', 'ColumnsNumberProvided');
      expect(store.state.inputStatus).toEqual('empty');
    });
  });
});
