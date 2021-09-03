import { createLocalVue } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { SafeStore } from '../../../../store/__tests__/utils';
import { urlXStoreModule } from '../module';
import { UrlActions, UrlGetters, UrlMutations, UrlState } from '../types';
import { resetUrlStateWith } from './utils';

function createUrlStore(
  state: Partial<UrlState>
): SafeStore<UrlState, UrlGetters, UrlMutations, UrlActions> {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  const store = new Store<UrlState>(urlXStoreModule as any);
  resetUrlStateWith(store, state);
  return store;
}

describe('testing URL module getters', () => {
  describe('testing urlParams getter', () => {
    it('re-maps values using the config', () => {
      const store = createUrlStore({
        query: 'salmorejo',
        filters: ['drinks'],
        relatedTags: ['with eggs'],
        page: 1,
        sort: 'default',
        extraParams: {
          warehouse: 12345
        },
        config: {
          urlParamNames: {
            query: 'q',
            relatedTags: 'tags',
            filters: 'filter'
          }
        }
      });

      expect(store.getters.urlParams).toEqual<UrlGetters['urlParams']>({
        query: {
          key: 'q',
          value: 'salmorejo'
        },
        filters: {
          key: 'filter',
          value: ['drinks']
        },
        relatedTags: {
          key: 'tags',
          value: ['with eggs']
        },
        page: {
          key: 'page',
          value: 1
        },
        sort: {
          key: 'sort',
          value: 'default'
        },
        warehouse: {
          key: 'warehouse',
          value: 12345
        }
      });
    });
  });
});
