import { createLocalVue } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { installNewXPlugin } from '../../../../__tests__/utils';
import { searchBoxXStoreModule } from '../module';
import { SearchBoxState } from '../types';
import { resetSearchBoxStateWith } from './utils';

describe('testing search box module actions', () => {
  const localVue = createLocalVue();

  localVue.config.productionTip = false; // Silent production console messages.
  localVue.use(Vuex);

  const store: Store<SearchBoxState> = new Store(searchBoxXStoreModule as any);

  installNewXPlugin({ store }, localVue);

  beforeEach(() => {
    resetSearchBoxStateWith(store);
  });

  describe('setUrlParams', () => {
    it('should set the query of the search box module', async () => {
      resetSearchBoxStateWith(store, { query: 'funko' });

      await store.dispatch('setUrlParams', { query: 'lego' });

      expect(store.state.query).toEqual('lego');
    });

    it('should set the query even if empty of the search box module', async () => {
      resetSearchBoxStateWith(store, { query: 'funko' });

      await store.dispatch('setUrlParams', { query: '' });

      expect(store.state.query).toEqual('');
    });
  });
});
