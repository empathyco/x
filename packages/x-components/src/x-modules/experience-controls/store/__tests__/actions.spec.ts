import { mount } from '@vue/test-utils';
import { getMockedAdapter, installNewXPlugin } from '../../../../__tests__/utils';
import { getExperienceControlsStub } from '../../../../__stubs__/experience-controls-stubs.factory';
import { createExperienceControlsStore, resetExperienceControlsStateWith } from './utils';

describe('testing experience controls module actions', () => {
  const mockedResponse = getExperienceControlsStub();

  const adapter = getMockedAdapter({
    experienceControls: mockedResponse
  });

  const store = createExperienceControlsStore();
  mount(
    {},
    {
      global: {
        plugins: [installNewXPlugin({ adapter, store })]
      }
    }
  );

  beforeEach(() => {
    resetExperienceControlsStateWith(store);
  });

  describe('fetchControls', () => {
    it('should return experience controls response', async () => {
      const experienceControls = await store.dispatch(
        'fetchExperienceControlsResponse',
        store.getters.experienceControlsRequest
      );
      expect(experienceControls).toEqual(mockedResponse);
    });
  });

  describe('fetchAndSaveControls', () => {
    it('should request and store controls and events in the state', async () => {
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

    it('should cancel the previous request if it is not yet resolved', async () => {
      const initialExperienceControls = store.state.controls;
      adapter.experienceControls.mockResolvedValueOnce(mockedResponse);

      const firstRequest = store.dispatch(
        'fetchAndSaveExperienceControlsResponse',
        store.getters.experienceControlsRequest
      );
      const secondRequest = store.dispatch(
        'fetchAndSaveExperienceControlsResponse',
        store.getters.experienceControlsRequest
      );

      await firstRequest;
      expect(store.state.status).toEqual('loading');
      expect(store.state.controls).toBe(initialExperienceControls);
      await secondRequest;
      expect(store.state.status).toEqual('success');
      expect(store.state.controls).toEqual(mockedResponse.controls);
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
