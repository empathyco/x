import { UrlParams } from '../../../../types/url-params';
import { createUrlStore } from './utils';

describe('testing Url module mutations', () => {
  const store = createUrlStore();

  describe('setParams', () => {
    it('should update the state with the correct url parameters', () => {
      const urlParams: Partial<UrlParams> = {
        query: 'sudadera',
        tag: ['capucha', 'disney'],
        page: 3,
        warehouse: '01234',
        consent: true
      };
      store.commit('setParams', urlParams);

      expect(store.state).toEqual<Partial<UrlParams>>({
        page: 3,
        query: 'sudadera',
        tag: ['capucha', 'disney'],
        filter: [],
        sort: '',
        scroll: 0,
        warehouse: '01234',
        consent: true,
        initialExtraParams: {}
      });
    });
  });
});
