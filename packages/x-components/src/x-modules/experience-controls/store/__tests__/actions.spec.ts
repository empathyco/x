import { getFetchMock, installNewXPlugin } from '../../../../__tests__/utils';
import { fetchExperienceControlsResponse } from '../actions/fetch-controls.action';
import { createExperienceControlsStore, resetExperienceControlsStateWith } from './utils';

describe('testing experience controls module actions', () => {
  const mockedControls = { numberOfCarousels: 10, resultsPerCarousels: 21 };
  const mockedResponse = {
    controls: { numberOfCarousels: 10, resultsPerCarousels: 21 },
    events: {}
  };
  // TODO: Remove this fetchMock when adapter is implemented
  const fetchMock = jest.fn(getFetchMock(mockedControls));
  window.fetch = fetchMock as any;

  const store = createExperienceControlsStore();
  installNewXPlugin({ store });

  beforeEach(() => {
    resetExperienceControlsStateWith(store);
  });

  describe('fetchControls', () => {
    it('should return controls', async () => {
      const response = await store.dispatch('fetchExperienceControlsResponse');
      expect(response).toEqual(mockedResponse);
    });
  });

  describe('fetchAndSaveControls', () => {
    it('should request and store controls and events in the state', async () => {
      const mockedResponseWithEvents = {
        controls: mockedControls,
        events: { ColumnsNumberProvided: 6 }
      };
      resetExperienceControlsStateWith(store, mockedResponseWithEvents);

      const actionPromise = store.dispatch(
        'fetchAndSaveExperienceControlsResponse',
        fetchExperienceControlsResponse
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
        store.dispatch('fetchAndSaveExperienceControlsResponse', fetchExperienceControlsResponse),
        store.dispatch('cancelFetchAndSaveControls')
      ]);
      expect(store.state.controls).toEqual(previousControls);
      expect(store.state.status).toEqual('success');
    });
  });
});
