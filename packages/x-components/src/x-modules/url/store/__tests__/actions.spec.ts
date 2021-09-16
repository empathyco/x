import { map } from '../../../../utils/object';
import { Dictionary } from '../../../../utils/types';
import { urlXStoreModule } from '../module';
import { Params, UrlParamValue } from '../types';
import { createUrlStore, resetUrlStateWith } from './utils';

describe('testing Url module actions', () => {
  const actionKeys = map(urlXStoreModule.actions, action => action);
  const store = createUrlStore();
  let historyReplaceFn: (data: any, title: string, url?: string | null | undefined) => void;

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
        params: {
          page: 2,
          query: 'doramion'
        }
      });

      await store.dispatch(actionKeys.updateUrl);

      resetUrlStateWith(store, { params: { page: 1, query: '' } });

      await store.dispatch(actionKeys.updateUrl);

      expect(window.location.search).toEqual('');
    });

    it('should push the state when the parameter is pushable', async () => {
      window.history.pushState = jest.fn();

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
          relatedTags: [],
          page: 1,
          scroll: 2
        }
      });

      await store.dispatch(actionKeys.updateUrl);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(window.history.pushState).toHaveBeenCalled();
    });

    it('should replace the state when the parameter is not pushable', async () => {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      historyReplaceFn = window.history.replaceState;
      window.history.replaceState = jest.fn();

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
          relatedTags: [],
          page: 1,
          scroll: 0
        }
      });

      await store.dispatch(actionKeys.updateUrl);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(window.history.replaceState).toHaveBeenCalled();
    });
  });

  describe(`${actionKeys.updateStoreFromUrl}`, () => {
    it('should update the state with the correct url parameters', async () => {
      // restore window replace function
      window.history.replaceState = historyReplaceFn;

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

      expect(store.state.params).toEqual<Partial<Params>>({
        page: 3,
        query: 'sudadera',
        relatedTags: ['capucha', 'disney'],
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
