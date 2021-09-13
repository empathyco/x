import { map } from '../../../../utils/object';
import { urlXStoreModule } from '../module';
import { createUrlStore, resetUrlStateWith } from './utils';

describe('testing Url module actions', () => {
  const actionKeys = map(urlXStoreModule.actions, action => action);
  const store = createUrlStore();
  beforeEach(() => {
    window.history.replaceState({}, document.title, window.location.hostname);
  });

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
      await store.dispatch(actionKeys.updateUrl);
      expect(window.location.search).toEqual(
        '?q=sudadera&tag=con+capucha&tag=disney&warehouse=0123999'
      );
    });

    // eslint-disable-next-line max-len
    it('should remove all the parameters from the url that are empty or not valid in the state', async () => {
      resetUrlStateWith(store, {
        page: 2,
        query: 'doramion'
      });
      await store.dispatch(actionKeys.updateUrl);
      resetUrlStateWith(store, { page: 1, query: '' });
      await store.dispatch(actionKeys.updateUrl);
      expect(window.location.search).toEqual('');
    });
  });
});
