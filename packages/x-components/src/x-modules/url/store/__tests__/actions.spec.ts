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
        params: {
          query: 'sudadera',
          filters: [],
          relatedTags: ['con capucha', 'disney'],
          page: 1
        },
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
