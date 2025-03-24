import { mount } from '@vue/test-utils';
import { Store } from 'vuex';
import { getRelatedPromptsStub } from '../../../../__stubs__';
import { getMockedAdapter, installNewXPlugin } from '../../../../__tests__/utils';
import { SafeStore } from '../../../../store/__tests__/utils';
import {
  RelatedPromptsActions,
  RelatedPromptsGetters,
  RelatedPromptsMutations,
  RelatedPromptsState
} from '../types';
import { relatedPromptsXStoreModule } from '../module';
import { UrlParams } from '../../../../types/index';
import { resetRelatedPromptsStateWith } from './utils';

describe('testing related prompts module actions', () => {
  const mockedRelatedPrompts = getRelatedPromptsStub();

  const adapter = getMockedAdapter({
    relatedPrompts: { relatedPrompts: mockedRelatedPrompts }
  });

  const store: SafeStore<
    RelatedPromptsState,
    RelatedPromptsGetters,
    RelatedPromptsMutations,
    RelatedPromptsActions
  > = new Store(relatedPromptsXStoreModule as any);
  mount(
    {},
    {
      global: {
        plugins: [installNewXPlugin({ adapter, store })]
      }
    }
  );

  beforeEach(() => {
    resetRelatedPromptsStateWith(store);
  });

  describe('fetchRelatedPrompts', () => {
    it('should return related prompts', async () => {
      resetRelatedPromptsStateWith(store, {
        query: 'honeyboo'
      });

      const relatedPrompts = await store.dispatch('fetchRelatedPrompts', store.getters.request);
      expect(relatedPrompts).toEqual(mockedRelatedPrompts);
    });

    it('should return `null` if there is not request', async () => {
      const relatedPrompts = await store.dispatch('fetchRelatedPrompts', store.getters.request);
      expect(relatedPrompts).toBeNull();
    });
  });

  describe('fetchAndSaveRelatedPrompts', () => {
    it('should request and store related prompts in the state', async () => {
      resetRelatedPromptsStateWith(store, {
        query: 'honeyboo'
      });

      const actionPromise = store.dispatch('fetchAndSaveRelatedPrompts', store.getters.request);
      expect(store.state.status).toEqual('loading');
      await actionPromise;
      expect(store.state.relatedPrompts).toEqual(mockedRelatedPrompts);
      expect(store.state.status).toEqual('success');
    });

    it('should not clear related prompts in the state if the query is empty', async () => {
      resetRelatedPromptsStateWith(store, { relatedPrompts: mockedRelatedPrompts });

      await store.dispatch('fetchAndSaveRelatedPrompts', store.getters.request);
      expect(store.state.relatedPrompts).toEqual(mockedRelatedPrompts);
    });

    it('should cancel the previous request if it is not yet resolved', async () => {
      resetRelatedPromptsStateWith(store, { query: 'steak' });
      const initialRelatedPrompts = store.state.relatedPrompts;
      adapter.relatedPrompts.mockResolvedValueOnce({
        relatedPrompts: mockedRelatedPrompts.slice(0, 1)
      });

      const firstRequest = store.dispatch('fetchAndSaveRelatedPrompts', store.getters.request);
      const secondRequest = store.dispatch('fetchAndSaveRelatedPrompts', store.getters.request);

      await firstRequest;
      expect(store.state.status).toEqual('loading');
      expect(store.state.relatedPrompts).toBe(initialRelatedPrompts);
      await secondRequest;
      expect(store.state.status).toEqual('success');
      expect(store.state.relatedPrompts).toEqual(mockedRelatedPrompts);
    });

    it('should set the status to error when it fails', async () => {
      resetRelatedPromptsStateWith(store, { query: 'milk' });
      adapter.relatedPrompts.mockRejectedValueOnce('Generic error');
      const relatedPrompts = store.state.relatedPrompts;
      await store.dispatch('fetchAndSaveRelatedPrompts', store.getters.request);

      expect(store.state.relatedPrompts).toBe(relatedPrompts);
      expect(store.state.status).toEqual('error');
    });
  });

  describe('cancelFetchAndSaveRelatedPrompts', () => {
    it('should cancel the request and do not modify the stored related prompts', async () => {
      resetRelatedPromptsStateWith(store, { query: 'honeyboo' });
      const previousRelatedPrompts = store.state.relatedPrompts;
      await Promise.all([
        store.dispatch('fetchAndSaveRelatedPrompts', store.getters.request),
        store.dispatch('cancelFetchAndSaveRelatedPrompts')
      ]);
      expect(store.state.relatedPrompts).toEqual(previousRelatedPrompts);
      expect(store.state.status).toEqual('success');
    });
  });

  describe('setUrlParams', () => {
    it('should set the params of the related prompts module', async () => {
      await store.dispatch('setUrlParams', { query: 'lego', prompt: 1 } as UrlParams);

      expect(store.state.query).toEqual('lego');
      expect(store.state.selectedPrompt).toEqual(1);
    });
  });
});
