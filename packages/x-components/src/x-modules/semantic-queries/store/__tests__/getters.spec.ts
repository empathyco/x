import Vuex, { Store } from 'vuex';
import Vue from 'vue';
import { SemanticQueriesState } from '../types';
import { semanticQueriesXStoreModule } from '../module';
import { resetSemanticQueriesStateWith } from './utils';

describe('semantic queries getters tests', () => {
  Vue.use(Vuex);
  const store: Store<SemanticQueriesState> = new Store(semanticQueriesXStoreModule as any);

  describe('request getter', () => {
    it('request contains all the necessary parameters', () => {
      resetSemanticQueriesStateWith(store, {
        query: 'test',
        totalResults: 1,
        config: {
          threshold: 2,
          maxItemsToRequest: 3
        },
        params: {
          lang: 'en'
        }
      });

      expect(store.getters.request).toEqual({
        query: 'test',
        extraParams: {
          lang: 'en',
          k: 3
        }
      });
    });

    it('contains the query if the totalResults are less than the threshold', () => {
      resetSemanticQueriesStateWith(store, {
        query: 'test',
        totalResults: 1,
        config: {
          threshold: 2
        }
      });

      expect(store.getters.request).toMatchObject({
        query: 'test'
      });
    });

    it('contains the query if the totalResults are equal than the threshold', () => {
      resetSemanticQueriesStateWith(store, {
        query: 'test',
        totalResults: 2,
        config: {
          threshold: 2
        }
      });

      expect(store.getters.request).toMatchObject({
        query: 'test'
      });
    });

    it('is null if there is no query or the totalResults are greater than the threshold', () => {
      resetSemanticQueriesStateWith(store, {
        query: ''
      });

      expect(store.getters.request).toBeNull();

      resetSemanticQueriesStateWith(store, {
        query: 'test',
        totalResults: 3,
        config: {
          threshold: 2
        }
      });

      expect(store.getters.request).toBeNull();
    });
  });
});
