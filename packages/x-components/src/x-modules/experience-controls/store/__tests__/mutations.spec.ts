import { Dictionary } from '@empathyco/x-utils';
import Vuex from 'vuex';
import { createLocalVue } from '@vue/test-utils';
import { XEventsTypes } from '../../../../wiring/index';
import { createExperienceControlsStore } from './utils';

describe('testing experience controls module mutations', () => {
  const localVue = createLocalVue();
  localVue.config.productionTip = false; // Silent production console messages.
  localVue.use(Vuex);
  const store = createExperienceControlsStore();

  describe('setControls', () => {
    it('should update the state with the new controls', () => {
      const controls: Dictionary<unknown> = {
        numberOfCarousels: 10,
        resultsPerCarousels: 21
      };
      store.commit('setControls', controls);

      expect(store.state.controls).toEqual<Dictionary<unknown>>({
        numberOfCarousels: 10,
        resultsPerCarousels: 21
      });
    });
  });

  describe('setEvents', () => {
    it('should update the state with the new events', () => {
      const events: Partial<XEventsTypes> = {
        UserAcceptedAQuery: 'sandal',
        ColumnsNumberProvided: 6
      };
      store.commit('setEvents', events);

      expect(store.state.events).toEqual<Partial<XEventsTypes>>({
        UserAcceptedAQuery: 'sandal',
        ColumnsNumberProvided: 6
      });
    });
  });

  describe('setParams', () => {
    it('should update the state with the new parameters', () => {
      const params: Dictionary<unknown> = {
        section: 'kids',
        store: 'Gijón',
        season: 'autum'
      };
      store.commit('setParams', params);

      expect(store.state.params).toEqual<Partial<Dictionary<unknown>>>({
        section: 'kids',
        store: 'Gijón',
        season: 'autum'
      });
    });
  });
});
