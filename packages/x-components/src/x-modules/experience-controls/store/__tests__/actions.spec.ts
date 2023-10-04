import { ExperienceControlsResponse } from '@empathyco/x-types';
import { getMockedAdapter, installNewXPlugin } from '../../../../__tests__/utils';
import { createExperienceControlsStore, resetExperienceControlsStateWith } from './utils';

describe('testing experience controls module actions', () => {
  const mockedControls = { numberOfCarousels: 10, resultsPerCarousels: 21 };
  const mockedResponse: ExperienceControlsResponse = {
    controls: { numberOfCarousels: 10, resultsPerCarousels: 21 },
    events: {}
  };
  const mockedResponseWithEvents = {
    controls: mockedControls,
    events: { ColumnsNumberProvided: 6 }
  };

  const adapter = getMockedAdapter({
    experienceControls: mockedResponse
  });

  const store = createExperienceControlsStore();
  installNewXPlugin({ adapter, store });

  beforeEach(() => {
    resetExperienceControlsStateWith(store);
  });

  describe('fetchControls', () => {
    it('should return controls', async () => {
      const experienceControls = await store.dispatch(
        'fetchExperienceControlsResponse',
        store.getters.request
      );
      expect(experienceControls).toEqual(mockedResponse);
    });
  });

  describe('fetchAndSaveControls', () => {
    it('should request and store controls and events in the state', async () => {
      resetExperienceControlsStateWith(store, mockedResponseWithEvents);

      const actionPromise = store.dispatch(
        'fetchAndSaveExperienceControlsResponse',
        store.getters.request
      );
      expect(store.state.status).toEqual('loading');
      await actionPromise;

      expect(store.state.controls).toEqual(mockedResponseWithEvents.controls);
      expect(store.state.events).toEqual(mockedResponseWithEvents.events);
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
        store.dispatch('fetchAndSaveExperienceControlsResponse', store.getters.request),
        store.dispatch('cancelFetchAndSaveControls')
      ]);
      expect(store.state.controls).toEqual(previousControls);
      expect(store.state.status).toEqual('success');
    });
  });
});
