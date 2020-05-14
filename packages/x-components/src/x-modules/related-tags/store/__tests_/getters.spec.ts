import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { map } from '../../../../utils';
import {
  getRelatedTagsStub,
  getSelectedRelatedTagsStub
} from '../../../../__stubs__/related-tags-stubs.factory';
import { relatedTagsXStoreModule } from '../module';
import { RelatedTagsState } from '../types';
import { resetRelatedTagsStateWith } from './utils';

describe('testing related tags module getters', () => {
  Vue.use(Vuex);
  const gettersKeys = map(relatedTagsXStoreModule.getters, getter => getter);
  const store: Store<RelatedTagsState> = new Store(relatedTagsXStoreModule as any);

  beforeEach(() => {
    resetRelatedTagsStateWith(store);
  });

  describe(`${gettersKeys.request} getter`, () => {
    it('should return a request object if there is a query', () => {
      resetRelatedTagsStateWith(store, {
        query: 'doraemon'
      });

      expect(store.getters[gettersKeys.request]).toEqual({
        query: 'doraemon',
        rows: 10,
        start: 0
      });
    });

    it('should return null when there is not query', () => {
      expect(store.getters[gettersKeys.request]).toBeNull();
    });

    it('should return null when there is an empty query', () => {
      resetRelatedTagsStateWith(store, {
        query: ' '
      });
      expect(store.getters[gettersKeys.request]).toBeNull();
    });
  });

  describe(`${gettersKeys.relatedTags} getter`, () => {
    const selectedRelatedTags = getSelectedRelatedTagsStub();
    const relatedTags = getRelatedTagsStub();

    it('should return the selected related tags with the related tags', () => {
      resetRelatedTagsStateWith(store, {
        selectedRelatedTags,
        relatedTags
      });
      expect(store.getters[gettersKeys.relatedTags]).toEqual([
        ...selectedRelatedTags,
        ...relatedTags
      ]);
    });
  });
});
