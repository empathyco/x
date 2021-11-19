import { createLocalVue } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { getTaggingResponseStub } from '../../../../__stubs__/tagging-response-stubs.factory';
import { getMockedAdapter, installNewXPlugin } from '../../../../__tests__/utils';
import { SafeStore } from '../../../../store/__tests__/utils';
import { taggingXStoreModule } from '../module';
import { TaggingActions, TaggingGetters, TaggingMutations, TaggingState } from '../types';
import { resetTaggingStateWith } from './utils';

describe('testing tagging module actions', () => {
  const queryTagging = getTaggingResponseStub();
  const adapter = getMockedAdapter();
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
    it('should tracks without session id if the consent is not provided', async () => {
      const spyOn = jest.spyOn(adapter, 'track');

      await store.dispatch('trackTagging', queryTagging);

      expect(spyOn).toHaveBeenCalled();
      expect(spyOn).toHaveBeenCalledWith(queryTagging);
    });

    it('should tracks without session id if the consent is false', async () => {
      resetTaggingStateWith(store, { consent: false });
      const spyOn = jest.spyOn(adapter, 'track');

      await store.dispatch('trackTagging', queryTagging);

      expect(spyOn).toHaveBeenCalled();
      expect(spyOn).toHaveBeenCalledWith(queryTagging);
    });

    it('should tracks with a session id if the consent is true', async () => {
      resetTaggingStateWith(store, { consent: true });
      const spyOn = jest.spyOn(adapter, 'track');

      await store.dispatch('trackTagging', queryTagging);

      expect(spyOn).toHaveBeenCalled();
      expect(spyOn).toHaveBeenCalledWith({
        url: queryTagging.url,
        params: {
          ...queryTagging.params,
          session: expect.any(String)
        }
      });
    });

    it('should tracks multiple times if the tagging info is an array', async () => {
      const spyOn = jest.spyOn(adapter, 'track');

      await store.dispatch('trackTagging', [queryTagging, queryTagging, queryTagging]);

      expect(spyOn).toHaveBeenCalledTimes(3);
    });
  });
});
