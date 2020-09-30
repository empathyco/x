import { createLocalVue } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { map } from '../../../../utils';
import { getRelatedTagsStub } from '../../../../__stubs__/related-tags-stubs.factory';
import { getMockedAdapter, installNewXPlugin } from '../../../../__tests__/utils';
import { relatedTagsXStoreModule } from '../module';
import { RelatedTagsState } from '../types';
import { resetRelatedTagsStateWith } from './utils';

describe('testing related tags module actions', () => {
  const mockedRelatedTags = getRelatedTagsStub();
  const adapter = getMockedAdapter({ relatedTags: { relatedTags: mockedRelatedTags } });

  const actionKeys = map(relatedTagsXStoreModule.actions, action => action);
  const localVue = createLocalVue();
  localVue.config.productionTip = false; // Silent production console messages.
  localVue.use(Vuex);

  const store: Store<RelatedTagsState> = new Store(relatedTagsXStoreModule as any);
  installNewXPlugin({ adapter, store }, localVue);

  beforeEach(() => {
    resetRelatedTagsStateWith(store);
  });

  describe(`${actionKeys.fetchRelatedTags}`, () => {
    it('should return related tags', async () => {
      resetRelatedTagsStateWith(store, {
        query: 'lego'
      });

      const relatedTags = await store.dispatch(actionKeys.fetchRelatedTags);
      expect(relatedTags).toEqual(mockedRelatedTags);
    });

    it('should return empty array if there is not request', async () => {
      const relatedTags = await store.dispatch(actionKeys.fetchRelatedTags);
      expect(relatedTags).toEqual([]);
    });
  });

  describe(`${actionKeys.fetchAndSaveRelatedTags}`, () => {
    it('should request and store related tags in the state', async () => {
      resetRelatedTagsStateWith(store, {
        query: 'lego'
      });

      await store.dispatch(actionKeys.fetchAndSaveRelatedTags);
      expect(store.state.relatedTags).toEqual(mockedRelatedTags);
    });

    it('should clear related tags in the state if the query is empty', async () => {
      await store.dispatch(actionKeys.fetchAndSaveRelatedTags);
      expect(store.state.relatedTags).toEqual([]);
    });
  });

  describe(`${actionKeys.toggleRelatedTag}`, () => {
    const relatedTagToSelect = mockedRelatedTags[0];

    it(
      'should add the toggled related tag to the selected related tag and remove ' +
        'the related tags',
      () => {
        resetRelatedTagsStateWith(store, {
          relatedTags: mockedRelatedTags
        });
        store.dispatch(actionKeys.toggleRelatedTag, relatedTagToSelect);
        expect(store.state.selectedRelatedTags).toEqual([relatedTagToSelect]);
        expect(store.state.relatedTags).toEqual([]);
      }
    );

    it(
      'should remove the related tag if it already exist in the selected related tags and add' +
        ' it again to the related tags',
      () => {
        const partialMockedRelatedTags = mockedRelatedTags.slice(1);
        resetRelatedTagsStateWith(store, {
          selectedRelatedTags: [relatedTagToSelect],
          relatedTags: partialMockedRelatedTags
        });
        store.dispatch(actionKeys.toggleRelatedTag, relatedTagToSelect);
        expect(store.state.selectedRelatedTags).toEqual([]);
        expect(store.state.relatedTags).toContain(relatedTagToSelect);
      }
    );
  });
});
