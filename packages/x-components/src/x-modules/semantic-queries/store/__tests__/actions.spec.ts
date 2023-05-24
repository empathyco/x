import { SemanticQueriesRequest } from '@empathyco/x-types';
import Vuex, { Store } from 'vuex';
import { createLocalVue } from '@vue/test-utils';
import { getMockedAdapter, installNewXPlugin } from '../../../../__tests__/utils';
import { getSemanticQueriesStub } from '../../../../__stubs__/semantic-queries-stubs.factory';
import { SafeStore } from '../../../../store/__tests__/utils';
import {
  SemanticQueriesActions,
  SemanticQueriesGetters,
  SemanticQueriesMutations,
  SemanticQueriesState
} from '../types';
import { semanticQueriesXStoreModule } from '../module';
import { resetSemanticQueriesStateWith } from './utils';

describe('semantic queries actions tests', () => {
  const semanticQueriesStub = getSemanticQueriesStub();

  const adapter = getMockedAdapter({
    semanticQueries: semanticQueriesStub
  });

  const localVue = createLocalVue();
  localVue.use(Vuex);

  const store: SafeStore<
    SemanticQueriesState,
    SemanticQueriesGetters,
    SemanticQueriesMutations,
    SemanticQueriesActions
  > = new Store(semanticQueriesXStoreModule as any);

  installNewXPlugin({ adapter, store }, localVue);

  beforeEach(() => {
    resetSemanticQueriesStateWith(store);
    jest.clearAllMocks();
  });

  describe('fetchSemanticQuery', () => {
    it('should make a semantic queries request', async () => {
      const request: SemanticQueriesRequest = {
        query: 'test',
        extraParams: {
          lang: 'en'
        }
      };

      const results = await store.dispatch('fetchSemanticQuery', request);

      expect(adapter.semanticQueries).toHaveBeenCalledTimes(1);
      expect(adapter.semanticQueries).toHaveBeenCalledWith(request);
      expect(results).toEqual(semanticQueriesStub);
    });

    it('should return null if the request is null or there is no query', async () => {
      let results = await store.dispatch('fetchSemanticQuery', null);

      expect(adapter.semanticQueries).not.toHaveBeenCalled();
      expect(results).toBeNull();

      results = await store.dispatch('fetchSemanticQuery', {
        query: '',
        extraParams: {
          lang: 'en'
        }
      });

      expect(adapter.semanticQueries).not.toHaveBeenCalled();
      expect(results).toBeNull();
    });
  });

  describe('fetchAndSaveSemanticQueries', () => {
    it('should fetch and save the semantic queries to the state', async () => {
      const request = {
        query: 'test',
        extraParams: {
          lang: 'en'
        }
      };

      adapter.semanticQueries.mockResolvedValueOnce({
        semanticQueries: [
          {
            modelName: 'SemanticQuery',
            query: 'test',
            distance: 1
          },
          {
            modelName: 'SemanticQuery',
            query: 'test',
            distance: 2
          }
        ]
      });

      await store.dispatch('fetchAndSaveSemanticQuery', request);

      expect(store.state.semanticQueries).toEqual([
        {
          modelName: 'SemanticQuery',
          query: 'test',
          distance: 1
        },
        {
          modelName: 'SemanticQuery',
          query: 'test',
          distance: 2
        }
      ]);

      await store.dispatch('fetchAndSaveSemanticQuery', null);

      expect(store.state.semanticQueries).toEqual([]);
    });
  });
});
