import { RelatedTagsRequest } from '@empathyco/x-adapter';
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
        query: 'doraemon',
        params: {
          catalog: 'es'
        }
      });

      expect(store.getters[gettersKeys.request]).toEqual<
        RelatedTagsRequest & { [key: string]: unknown }
        // TODO - Remove when the facets refactor is completed.
      >({
        query: 'doraemon',
        relatedTags: [],
        rows: 10,
        start: 0,
        catalog: 'es'
      });
    });

    it('should return a request object with the selected related tags', () => {
      const selectedRelatedTags = getSelectedRelatedTagsStub();
      resetRelatedTagsStateWith(store, {
        query: 'nobita',
        selectedRelatedTags: selectedRelatedTags,
        params: {
          warehouse: 1234
        }
      });

      expect(store.getters[gettersKeys.request]).toEqual<
        RelatedTagsRequest & { [key: string]: unknown }
        // TODO - Remove when the facets refactor is completed.
      >({
        query: 'nobita',
        relatedTags: selectedRelatedTags,
        rows: 10,
        start: 0,
        warehouse: 1234
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
