import Vuex from 'vuex';
import { createLocalVue } from '@vue/test-utils';
import { getMockedAdapter, installNewXPlugin } from '../../../../__tests__/utils';
import { getExperienceControlsStub } from '../../../../__stubs__/experience-controls-subs.factory';
import { createExperienceControlsStore, resetExperienceControlsStateWith } from './utils';

describe('testing experience controls module actions', () => {
  const mockedResponse = getExperienceControlsStub();

  const adapter = getMockedAdapter({
    experienceControls: mockedResponse
  });

  const localVue = createLocalVue();
  localVue.config.productionTip = false; // Silent production console messages.
  localVue.use(Vuex);
  const store = createExperienceControlsStore();
  installNewXPlugin({ adapter, store }, localVue);

  beforeEach(() => {
    resetExperienceControlsStateWith(store);
  });

  describe('fetchControls', () => {
    it('should return controls', async () => {
      const experienceControls = await store.dispatch(
        'fetchExperienceControlsResponse',
        store.getters.experienceControlsRequest
      );
      expect(experienceControls).toEqual(mockedResponse);
    });
  });

  describe('fetchAndSaveControls', () => {
    it('should request and store controls and events in the state', async () => {
      resetExperienceControlsStateWith(store, {});

      const actionPromise = store.dispatch(
        'fetchAndSaveExperienceControlsResponse',
        store.getters.experienceControlsRequest
      );
      expect(store.state.status).toEqual('loading');
      await actionPromise;

      expect(store.state.controls).toEqual(mockedResponse.controls);
      expect(store.state.events).toEqual(mockedResponse.events);
      expect(store.state.status).toEqual('success');
    });
  });

  describe('cancelFetchAndSaveControls', () => {
    it('should cancel the request and do not modify the stored controls', async () => {
      resetExperienceControlsStateWith(store, {
        controls: { numberOfCarousels: 20, resultsPerCarousels: 6 }
      });
      const previousControls = store.state.controls;
      await Promise.all([
        store.dispatch(
          'fetchAndSaveExperienceControlsResponse',
          store.getters.experienceControlsRequest
        ),
        store.dispatch('cancelFetchAndSaveControls')
      ]);
      expect(store.state.controls).toEqual(previousControls);
      expect(store.state.status).toEqual('success');
    });
  });
});
