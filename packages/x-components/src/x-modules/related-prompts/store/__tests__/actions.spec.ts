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

      const relatedPrompts = await store.dispatch('fetchRelatedPrompts', {
        extraParams: store.state.params,
        query: store.state.query
      });
      expect(relatedPrompts).toEqual(mockedRelatedPrompts);
    });

    it('should return `null` if there is not request', async () => {
      const relatedPrompts = await store.dispatch('fetchRelatedPrompts', {
        extraParams: store.state.params,
        query: ''
      });
      expect(relatedPrompts).toBeNull();
    });
  });

  describe('fetchAndSaveRelatedPrompts', () => {
    it('should request and store related prompts in the state', async () => {
      resetRelatedPromptsStateWith(store, {
        query: 'honeyboo'
      });

      const actionPromise = store.dispatch('fetchAndSaveRelatedPrompts', store.state.query);
      expect(store.state.status).toEqual('initial');
      await actionPromise;
      expect(store.state.relatedPrompts['honeyboo'].relatedPromptsProducts).toEqual(
        mockedRelatedPrompts
      );
      expect(store.state.status).toEqual('success');
    });

    it('should not clear related prompts in the state if the query is empty', async () => {
      resetRelatedPromptsStateWith(store, {
        query: 'dress',
        relatedPrompts: {
          query: {
            relatedPromptsProducts: mockedRelatedPrompts
          }
        }
      });
      await store.dispatch('fetchAndSaveRelatedPrompts', store.state.query);
      expect(store.state.relatedPrompts[store.state.query].relatedPromptsProducts).toEqual(
        mockedRelatedPrompts
      );
    });

    it('should set the status to error when it fails', async () => {
      resetRelatedPromptsStateWith(store, { query: 'milk' });
      adapter.relatedPrompts.mockRejectedValueOnce('Generic error');
      const relatedPrompts = store.state.relatedPrompts;
      await store.dispatch('fetchAndSaveRelatedPrompts', store.state.query);

      expect(store.state.relatedPrompts).toBe(relatedPrompts);
      expect(store.state.status).toEqual('error');
    });
  });
});
