import { createLocalVue } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { map } from '../../../../utils';
import { getResultsStub } from '../../../../__stubs__/results-stubs.factory';
import { getMockedAdapter, installNewXPlugin } from '../../../../__tests__/utils';
import { identifierResultsXStoreModule } from '../module';
import { IdentifierResultsState } from '../types';
import { resetIdentifierResultsStateWith } from './utils';

describe('testing identifier results module actions', () => {
  const mockedResults = getResultsStub();
  const adapter = getMockedAdapter({ searchById: { results: mockedResults } });

  const actionKeys = map(identifierResultsXStoreModule.actions, action => action);
  const localVue = createLocalVue();
  localVue.config.productionTip = false; // Silent production console messages.
  localVue.use(Vuex);

  const store: Store<IdentifierResultsState> = new Store(identifierResultsXStoreModule as any);
  installNewXPlugin({ adapter, store }, localVue);

  beforeEach(() => {
    resetIdentifierResultsStateWith(store);
  });

  describe(`${actionKeys.fetchIdentifierResults}`, () => {
    it('should return identifier results', async () => {
      resetIdentifierResultsStateWith(store, { query: 'xc' });

      const identifierResults = await store.dispatch(actionKeys.fetchIdentifierResults);
      expect(identifierResults).toEqual(mockedResults);
    });

    it('should return empty array if there is not request', async () => {
      const identifierResults = await store.dispatch(actionKeys.fetchIdentifierResults);
      expect(identifierResults).toEqual([]);
    });
  });

  describe(`${actionKeys.fetchAndSaveIdentifierResults}`, () => {
    it('should request and store identifier results in the state', async () => {
      resetIdentifierResultsStateWith(store, { query: 'xc' });

      await store.dispatch(actionKeys.fetchAndSaveIdentifierResults);
      expect(store.state.identifierResults).toEqual(mockedResults);
    });
  });

  describe(`${actionKeys.saveQuery}`, () => {
    const identifierDetectionRegexp = '^[0-9]{2,}$';
    it('should store the query in the state if it matches the regex', async () => {
      resetIdentifierResultsStateWith(store, { config: { identifierDetectionRegexp } });

      await store.dispatch(actionKeys.saveQuery, '1906');
      expect(store.state.query).toEqual('1906');
    });
    it('should not store query in the state if it matches the regex', async () => {
      resetIdentifierResultsStateWith(store, { config: { identifierDetectionRegexp } });

      await store.dispatch(actionKeys.saveQuery, '1 thousand nine hundred and 6');
      expect(store.state.query).toEqual('');
    });
  });
});
