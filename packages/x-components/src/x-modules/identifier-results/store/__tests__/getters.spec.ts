import { map } from '@empathyco/x-utils';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { identifierResultsXStoreModule } from '../module';
import { IdentifierResultsState } from '../types';
import { resetIdentifierResultsStateWith } from './utils';

describe('testing identifier results module getters', () => {
  Vue.use(Vuex);
  const gettersKeys = map(identifierResultsXStoreModule.getters, getter => getter);
  const store: Store<IdentifierResultsState> = new Store(identifierResultsXStoreModule as any);

  beforeEach(() => {
    resetIdentifierResultsStateWith(store);
  });

  describe(`${gettersKeys.identifierResultsRequest} getter`, () => {
    it('should return a request object if there is a query', () => {
      resetIdentifierResultsStateWith(store, {
        query: 'shin chan',
        params: { store: 'es' }
      });

      expect(store.getters[gettersKeys.identifierResultsRequest]).toEqual({
        query: 'shin chan',
        rows: 10,
        start: 0,
        extraParams: {
          store: 'es'
        }
      });
    });

    it('should return null when there is not query', () => {
      expect(store.getters[gettersKeys.identifierResultsRequest]).toBeNull();
    });

    it('should return null when there is an empty query', () => {
      resetIdentifierResultsStateWith(store, { query: ' ' });
      expect(store.getters[gettersKeys.identifierResultsRequest]).toBeNull();
    });
  });

  describe(`${gettersKeys.identifierDetectionRegexp} getter`, () => {
    it('should return a RegExp object using the configured regex', () => {
      const identifierDetectionRegexp = '^[0-3]{2,}$';
      resetIdentifierResultsStateWith(store, { config: { identifierDetectionRegexp } });

      expect(store.getters[gettersKeys.identifierDetectionRegexp]).toEqual(
        new RegExp(identifierDetectionRegexp)
      );
    });
  });

  describe(`${gettersKeys.identifierHighlightRegexp} getter`, () => {
    it(
      'should return a RegExp object to match the query without spaces and an optional ' +
        'separator char after each character of the query',
      () => {
        const query = ' 12 / 34';
        const separatorChars = '-/ ';
        resetIdentifierResultsStateWith(store, { query, config: { separatorChars } });
        expect(store.getters[gettersKeys.identifierHighlightRegexp]).toEqual(
          // eslint-disable-next-line no-useless-escape
          /(1[\-\/\ ]*2[\-\/\ ]*3[\-\/\ ]*4)/i
        );
      }
    );
  });
});
