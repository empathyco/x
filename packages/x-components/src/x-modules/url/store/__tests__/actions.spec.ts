import { Dictionary } from '../../../../utils/types';
import { UrlParams, UrlParamValue } from '../types';
import { createUrlStore } from './utils';

describe('testing Url module actions', () => {
  const store = createUrlStore();

  describe('updateStoreFromUrl', () => {
    it('should update the state with the correct url parameters', async () => {
      const urlParams: Partial<UrlParams> = {
        query: 'sudadera',
        tag: ['capucha', 'disney'],
        page: 3,
        warehouse: '01234',
        consent: true
      };
      await store.dispatch('updateStoreFromUrl', urlParams);

      expect(store.state.params).toEqual<Partial<UrlParams>>({
        page: 3,
        query: 'sudadera',
        tag: ['capucha', 'disney'],
        filter: [],
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
