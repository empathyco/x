import { createLocalVue } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { installNewXPlugin } from '../../../../__tests__/utils';
import { map } from '../../../../utils/object';
import { urlXStoreModule } from '../module';
import { UrlState } from '../types';
import { resetUrlStateWith } from './utils';

describe('testing Url module actions', () => {
  const actionKeys = map(urlXStoreModule.actions, action => action);
  const localVue = createLocalVue();
  localVue.config.productionTip = false; // Silent production console messages.
  localVue.use(Vuex);

  const store: Store<UrlState> = new Store(urlXStoreModule as any);
  installNewXPlugin({ store }, localVue);

  describe(`${actionKeys.updateUrl}`, () => {
    it('should add the correct params to the url', async () => {
      resetUrlStateWith(store, {
        config: {
          urlParamNames: {
            query: 'q',
            relatedTags: 'tag'
          }
        },
        params: {
          query: 'sudadera',
          filters: [],
          relatedTags: ['con capucha', 'disney'],
          page: 1
        },
        extraParams: { warehouse: '0123999' }
      });

      const expectedUrlParams = '?q=sudadera&tag=con+capucha&tag=disney&warehouse=0123999';

      await store.dispatch(actionKeys.updateUrl);
      expect(window.location.search).toEqual(expectedUrlParams);
    });
  });

  describe(`${actionKeys.updateStoreFromUrl}`, () => {
    it('should update the state with the correct url parameters', async () => {
      const url = new URL(
        window.location.href +
          '?q=sudadera&tag=capucha&tag=disney&page=3&warehouse=01234&consent=true&store=1111'
      );
      window.history.replaceState({ ...window.history.state }, document.title, url.href);
      resetUrlStateWith(store, {
        config: {
          urlParamNames: {
            query: 'q',
            relatedTags: 'tag'
          }
        },
        extraParams: { warehouse: '', consent: false }
      });

      await store.dispatch(actionKeys.updateStoreFromUrl);
      expect(store.state.params.page).toEqual(3);
      expect(store.state.params.query).toEqual('sudadera');
      expect(store.state.params.relatedTags).toEqual(['capucha', 'disney']);
      expect(store.state.extraParams.warehouse).toEqual('01234');
      expect(store.state.extraParams.consent).toEqual(true);
      expect(store.state.extraParams.store).toBeUndefined();
    });
  });
});
