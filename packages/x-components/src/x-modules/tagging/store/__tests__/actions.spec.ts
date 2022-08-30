import { createLocalVue } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { TaggingRequest } from '@empathyco/x-types';
import { getTaggingResponseStub } from '../../../../__stubs__/tagging-response-stubs.factory';
import { XComponentsAdapterDummy } from '../../../../__tests__/adapter.dummy';
import { installNewXPlugin } from '../../../../__tests__/utils';
import { SafeStore } from '../../../../store/__tests__/utils';
import { taggingXStoreModule } from '../module';
import { TaggingActions, TaggingGetters, TaggingMutations, TaggingState } from '../types';
import { resetTaggingStateWith } from './utils';

describe('testing tagging module actions', () => {
  const queryTagging = getTaggingResponseStub();
  const adapter = XComponentsAdapterDummy;
  const localVue = createLocalVue();
  localVue.config.productionTip = false; // Silent production console messages.
  localVue.use(Vuex);

  const store: SafeStore<TaggingState, TaggingGetters, TaggingMutations, TaggingActions> =
    new Store(taggingXStoreModule as any);
  installNewXPlugin({ adapter, store }, localVue);

  beforeEach(() => {
    resetTaggingStateWith(store);
    jest.clearAllMocks();
  });

  /* eslint-disable @typescript-eslint/unbound-method */
  describe('track', () => {
    it('should track without session id if the consent is not provided', async () => {
      await store.dispatch('track', queryTagging);

      expect(adapter.tagging).toHaveBeenCalled();
      expect(adapter.tagging).toHaveBeenCalledWith(queryTagging);
      const payload: TaggingRequest = (adapter.tagging as jest.Mock<any, any>).mock.calls[0][0];
      expect('session' in payload.params).toBe(false);
    });

    it('should track without session id if the consent is false', async () => {
      resetTaggingStateWith(store, { consent: false });
      await store.dispatch('track', queryTagging);

      expect(adapter.tagging).toHaveBeenCalled();
      expect(adapter.tagging).toHaveBeenCalledWith(queryTagging);
      const payload: TaggingRequest = (adapter.tagging as jest.Mock<any, any>).mock.calls[0][0];
      expect('session' in payload.params).toBe(false);
    });

    it('should track with a session id if the consent is true', async () => {
      resetTaggingStateWith(store, { consent: true });

      await store.dispatch('track', queryTagging);

      expect(adapter.tagging).toHaveBeenCalled();
      expect(adapter.tagging).toHaveBeenCalledWith({
        url: queryTagging.url,
        params: {
          ...queryTagging.params,
          session: expect.any(String)
        }
      });
    });

    it('should tracks multiple times if the tagging info is an array', async () => {
      await store.dispatch('track', [queryTagging, queryTagging, queryTagging]);

      expect(adapter.tagging).toHaveBeenCalledTimes(3);
      expect(adapter.tagging).toHaveBeenNthCalledWith(1, queryTagging);
      expect(adapter.tagging).toHaveBeenNthCalledWith(2, queryTagging);
      expect(adapter.tagging).toHaveBeenNthCalledWith(3, queryTagging);
    });
  });
});
