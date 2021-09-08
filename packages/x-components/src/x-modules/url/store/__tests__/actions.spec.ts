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
        query: 'sudadera',
        filters: [],
        relatedTags: ['con capucha', 'disney'],
        page: 1,
        extraParams: { warehouse: '0123999' }
      });

      const expectedUrlParams = '?q=sudadera&tag=con+capucha&tag=disney&warehouse=0123999';

      await store.dispatch(actionKeys.updateUrl);
      expect(window.location.search).toEqual(expectedUrlParams);
    });
  });
});
