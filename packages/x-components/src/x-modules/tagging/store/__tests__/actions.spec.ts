import { createLocalVue } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { getTaggingResponseStub } from '../../../../__stubs__/tagging-response-stubs.factory';
import { SearchAdapterDummy } from '../../../../__tests__/adapter.dummy';
import { installNewXPlugin } from '../../../../__tests__/utils';
import { SafeStore } from '../../../../store/__tests__/utils';
import { taggingXStoreModule } from '../module';
import { TaggingActions, TaggingGetters, TaggingMutations, TaggingState } from '../types';
import { resetTaggingStateWith } from './utils';

describe('testing tagging module actions', () => {
  const queryTagging = getTaggingResponseStub();
  const adapter = SearchAdapterDummy;
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

  describe('trackTagging', () => {
    it('should track without session id if the consent is not provided', async () => {
      await store.dispatch('track', queryTagging);

      //eslint-disable-next-line @typescript-eslint/unbound-method
      expect(adapter.track).toHaveBeenCalled();
      //eslint-disable-next-line @typescript-eslint/unbound-method
      expect(adapter.track).toHaveBeenCalledWith(queryTagging);
    });

    it('should track without session id if the consent is false', async () => {
      resetTaggingStateWith(store, { consent: false });
      await store.dispatch('track', queryTagging);

      //eslint-disable-next-line @typescript-eslint/unbound-method
      expect(adapter.track).toHaveBeenCalled();
      //eslint-disable-next-line @typescript-eslint/unbound-method
      expect(adapter.track).toHaveBeenCalledWith(queryTagging);
    });

    it('should track with a session id if the consent is true', async () => {
      resetTaggingStateWith(store, { consent: true });

      await store.dispatch('track', queryTagging);

      //eslint-disable-next-line @typescript-eslint/unbound-method
      expect(adapter.track).toHaveBeenCalled();
      //eslint-disable-next-line @typescript-eslint/unbound-method
      expect(adapter.track).toHaveBeenCalledWith({
        url: queryTagging.url,
        params: {
          ...queryTagging.params,
          session: expect.any(String)
        }
      });
    });

    it('should tracks multiple times if the tagging info is an array', async () => {
      await store.dispatch('track', [queryTagging, queryTagging, queryTagging]);

      //eslint-disable-next-line @typescript-eslint/unbound-method
      expect(adapter.track).toHaveBeenCalledTimes(3);
      //eslint-disable-next-line @typescript-eslint/unbound-method
      expect(adapter.track).toHaveBeenNthCalledWith(1, queryTagging);
      //eslint-disable-next-line @typescript-eslint/unbound-method
      expect(adapter.track).toHaveBeenNthCalledWith(2, queryTagging);
      //eslint-disable-next-line @typescript-eslint/unbound-method
      expect(adapter.track).toHaveBeenNthCalledWith(3, queryTagging);
    });
  });
});
