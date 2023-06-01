import Vuex, { Store } from 'vuex';
import Vue from 'vue';
import { SemanticQueriesState } from '../types';
import { semanticQueriesXStoreModule } from '../module';
import { resetSemanticQueriesStateWith } from './utils';

describe('semantic queries getters tests', () => {
  Vue.use(Vuex);
  const store: Store<SemanticQueriesState> = new Store(semanticQueriesXStoreModule as any);

  describe('request getter', () => {
    it('returns the query if the totalResults are less than the threshold', () => {
      resetSemanticQueriesStateWith(store, {
        query: 'test',
        totalResults: 1,
        config: {
          threshold: 2
        },
        params: {
          lang: 'en'
        }
      });

      expect(store.getters.request).toEqual({
        query: 'test',
        extraParams: {
          lang: 'en'
        }
      });
    });

    it('returns the query if the totalResults is equal than the threshold', () => {
      resetSemanticQueriesStateWith(store, {
        query: 'test',
        totalResults: 2,
        config: {
          threshold: 2
        },
        params: {
          lang: 'en'
        }
      });

      expect(store.getters.request).toEqual({
        query: 'test',
        extraParams: {
          lang: 'en'
        }
      });
    });

    it('is null if there is no query or the totalResults is higher than the threshold', () => {
      resetSemanticQueriesStateWith(store, {
        query: '',
        totalResults: 2,
        config: {
          threshold: 2
        },
        params: {
          lang: 'en'
        }
      });

      expect(store.getters.request).toBeNull();

      resetSemanticQueriesStateWith(store, {
        query: 'test',
        totalResults: 3,
        config: {
          threshold: 2
        },
        params: {
          lang: 'en'
        }
      });

      expect(store.getters.request).toBeNull();
    });

    it('sets the `maxItemsToRequest` config as an extraParam in the request', () => {
      resetSemanticQueriesStateWith(store, {
        query: 'test',
        totalResults: 2,
        config: {
          threshold: 3,
          maxItemsToRequest: 5
        },
        params: {
          lang: 'en'
        }
      });

      expect(store.getters.request).toEqual({
        query: 'test',
        extraParams: {
          k: 5,
          lang: 'en'
        }
      });
    });
  });
});
