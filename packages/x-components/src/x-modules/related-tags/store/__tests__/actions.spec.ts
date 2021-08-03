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

      const actionPromise = store.dispatch(actionKeys.fetchAndSaveRelatedTags);
      expect(store.state.status).toEqual('loading');
      await actionPromise;
      expect(store.state.relatedTags).toEqual(mockedRelatedTags);
      expect(store.state.status).toEqual('success');
    });

    it('should clear related tags in the state if the query is empty', async () => {
      await store.dispatch(actionKeys.fetchAndSaveRelatedTags);
      expect(store.state.relatedTags).toEqual([]);
    });

    it('should cancel the previous request if it is not yet resolved', async () => {
      resetRelatedTagsStateWith(store, { query: 'coffee' });
      const initialRelatedTags = store.state.relatedTags;
      adapter.getRelatedTags.mockResolvedValueOnce({ relatedTags: mockedRelatedTags.slice(0, 1) });

      const firstRequest = store.dispatch(actionKeys.fetchAndSaveRelatedTags);
      const secondRequest = store.dispatch(actionKeys.fetchAndSaveRelatedTags);

      await firstRequest;
      expect(store.state.status).toEqual('loading');
      expect(store.state.relatedTags).toBe(initialRelatedTags);
      await secondRequest;
      expect(store.state.status).toEqual('success');
      expect(store.state.relatedTags).toEqual(mockedRelatedTags);
    });

    it('should set the status to error when it fails', async () => {
      resetRelatedTagsStateWith(store, { query: 'lego' });
      adapter.getRelatedTags.mockRejectedValueOnce('Generic error');
      const relatedTags = store.state.relatedTags;
      await store.dispatch(actionKeys.fetchAndSaveRelatedTags);

      expect(store.state.relatedTags).toBe(relatedTags);
      expect(store.state.status).toEqual('error');
    });
  });

  describe(`${actionKeys.cancelFetchAndSaveRelatedTags}`, () => {
    it('should cancel the request and do not modify the stored related tags', async () => {
      resetRelatedTagsStateWith(store, { query: 'lego' });
      const previousRelatedTags = store.state.relatedTags;
      await Promise.all([
        store.dispatch(actionKeys.fetchAndSaveRelatedTags),
        store.dispatch(actionKeys.cancelFetchAndSaveRelatedTags)
      ]);
      expect(store.state.relatedTags).toEqual(previousRelatedTags);
      expect(store.state.status).toEqual('success');
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
