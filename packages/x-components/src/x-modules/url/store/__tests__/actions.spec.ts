import { Dictionary } from '../../../../utils/types';
import { Params, UrlParamValue } from '../types';
import { createUrlStore, resetUrlStateWith } from './utils';

describe('testing Url module actions', () => {
  const store = createUrlStore();
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const historyReplaceFn = window.history.replaceState;

  beforeEach(() => {
    window.history.replaceState = historyReplaceFn;
    window.history.replaceState({}, document.title, window.location.hostname);
  });

  describe('updateUrl', () => {
    it('should add the correct params to the url', async () => {
      resetUrlStateWith(store, {
        config: {
          urlParamNames: {
            query: 'q',
            relatedTag: 'tag'
          }
        },
        params: {
          query: 'sudadera',
          filters: [],
          relatedTag: ['con capucha', 'disney'],
          page: 1
        },
        extraParams: { warehouse: '0123999' }
      });

      await store.dispatch('updateUrl');

      expect(window.location.search).toEqual(
        '?q=sudadera&tag=con+capucha&tag=disney&warehouse=0123999'
      );
    });

    // eslint-disable-next-line max-len
    it('should remove all the parameters from the url that are empty or not valid in the state', async () => {
      resetUrlStateWith(store, {
        params: {
          page: 2,
          query: 'doramion'
        }
      });

      await store.dispatch('updateUrl');

      resetUrlStateWith(store, { params: { page: 1, query: '' } });

      await store.dispatch('updateUrl');

      expect(window.location.search).toEqual('');
    });

    it('should push the state when the parameter is pushable', async () => {
      window.history.pushState = jest.fn();

      resetUrlStateWith(store, {
        config: {
          urlParamNames: {
            query: 'q',
            relatedTag: 'tag'
          }
        },
        params: {
          query: 'sudadera',
          filters: [],
          relatedTag: [],
          page: 1,
          scroll: 2
        }
      });

      await store.dispatch('updateUrl');

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(window.history.pushState).toHaveBeenCalled();
    });

    it('should replace the state when the parameter is not pushable', async () => {
      window.history.replaceState = jest.fn();

      resetUrlStateWith(store, {
        config: {
          urlParamNames: {
            query: 'q',
            relatedTag: 'tag'
          }
        },
        params: {
          query: 'sudadera',
          filters: [],
          relatedTag: [],
          page: 1,
          scroll: 0
        }
      });

      await store.dispatch('updateUrl');

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(window.history.replaceState).toHaveBeenCalled();
    });
  });

  describe('updateStoreFromUrl', () => {
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
            relatedTag: 'tag'
          }
        },
        extraParams: { warehouse: '', consent: false }
      });

      await store.dispatch('updateStoreFromUrl');

      expect(store.state.params).toEqual<Partial<Params>>({
        page: 3,
        query: 'sudadera',
        relatedTag: ['capucha', 'disney'],
        filters: [],
        sort: '',
        scroll: 0
      });
      expect(store.state.extraParams).toEqual<Dictionary<UrlParamValue>>({
        warehouse: '01234',
        consent: true
      });
    });
  });
});
