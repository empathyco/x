import { createLocalVue } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { map } from '../../../../utils';
import { installNewXPlugin } from '../../../../__tests__/utils';
import { searchBoxXStoreModule } from '../module';
import { SearchBoxState } from '../types';
import { resetSearchBoxStateWith } from './utils';

describe('testing search box module actions', () => {
  const actionKeys = map(searchBoxXStoreModule.actions, action => action);
  const localVue = createLocalVue();

  localVue.config.productionTip = false; // Silent production console messages.
  localVue.use(Vuex);

  const store: Store<SearchBoxState> = new Store(searchBoxXStoreModule as any);

  installNewXPlugin({ store }, localVue);

  beforeEach(() => {
    resetSearchBoxStateWith(store);
  });

  describe(`${actionKeys.setQueryFromUrl}`, () => {
    it('should set the query of the search box module', async () => {
      resetSearchBoxStateWith(store, { query: 'funko' });

      await store.dispatch(actionKeys.setQueryFromUrl, { query: 'lego' });

      expect(store.state.query).toEqual('lego');
    });

    it('should not set the query of the search box module', async () => {
      resetSearchBoxStateWith(store, { query: 'funko' });

      await store.dispatch(actionKeys.setQueryFromUrl, { page: 2 });

      expect(store.state.query).toEqual('funko');
    });
  });
});
