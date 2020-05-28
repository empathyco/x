import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { RootXStoreState } from '../../../../store/store.types';
import { DeepPartial } from '../../../../utils/types';
import { getRelatedTagsStub } from '../../../../__stubs__/related-tags-stubs.factory';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import RelatedTag from '../related-tag.vue';
import { resetStoreRelatedTagsState } from './utils';

describe('testing related tag item component', () => {
  const relatedTag = getRelatedTagsStub()[0];

  let relatedTagWrapper: Wrapper<Vue>;
  let localVue: typeof Vue;
  let store: Store<DeepPartial<RootXStoreState>>;

  beforeEach(() => {
    localVue = createLocalVue();
    localVue.use(Vuex);
    store = new Store<DeepPartial<RootXStoreState>>({});

    installNewXPlugin({ store }, localVue);
    resetStoreRelatedTagsState(store);

    relatedTagWrapper = mount(RelatedTag, {
      localVue,
      store,
      propsData: { relatedTag }
    });
  });

  it('is an XComponent and has an XModule', () => {
    expect(isXComponent(relatedTagWrapper.vm)).toEqual(true);
    expect(getXComponentXModuleName(relatedTagWrapper.vm)).toBe('relatedTags');
  });

  it('renders a button overriding the default content', () => {
    const wrapperComponent = {
      template: `
        <RelatedTag :relatedTag="relatedTag">
          <template #default="{ relatedTag }">
            <img data-test="related-tag-icon" src="./related-tag.svg"/>
            <span data-test="related-tag-tag" :aria-label="relatedTag.tag">
              {{ relatedTag.tag }}
            </span>
          </template>
          </RelatedTag>
       `,
      props: ['relatedTag'],
      components: {
        RelatedTag
      }
    };

    const relatedTagCustomWrapper = mount(wrapperComponent, {
      localVue,
      propsData: { relatedTag },
      store
    });
    expect(relatedTagCustomWrapper.find(getDataTestSelector('related-tag')).element).toBeDefined();
    expect(
      relatedTagCustomWrapper.find(getDataTestSelector('related-tag-icon')).element
    ).toBeDefined();
    expect(relatedTagCustomWrapper.find(getDataTestSelector('related-tag-tag')).text()).toEqual(
      relatedTag.tag
    );
  });

  it(
    'emits UserSelectedARelatedTag and UserPickedARelatedTag when a related tag ' + 'is selected',
    () => {
      const listener = jest.fn();

      relatedTagWrapper.vm.$x.on('UserSelectedARelatedTag').subscribe(listener);
      relatedTagWrapper.vm.$x.on('UserPickedARelatedTag').subscribe(listener);
      relatedTagWrapper.trigger('click');

      expect(listener).toHaveBeenNthCalledWith(1, relatedTag);
      expect(listener).toHaveBeenNthCalledWith(2, relatedTag);
    }
  );

  it(
    'emits UserDeselectedARelatedTag and UserPickedARelatedTag when a related tag ' +
      'is deselected',
    async () => {
      const listener = jest.fn();

      resetStoreRelatedTagsState(store, {
        selectedRelatedTags: [relatedTag]
      });
      await localVue.nextTick();
      relatedTagWrapper.vm.$x.on('UserPickedARelatedTag').subscribe(listener);
      relatedTagWrapper.vm.$x.on('UserDeselectedARelatedTag').subscribe(listener);
      relatedTagWrapper.trigger('click');

      expect(listener).toHaveBeenNthCalledWith(1, relatedTag);
      expect(listener).toHaveBeenNthCalledWith(2, relatedTag);
    }
  );

  it('renders a button with the tag of the related tag', () => {
    const relatedTagItem = relatedTagWrapper.find(getDataTestSelector('related-tag'));
    expect(relatedTagItem.text()).toEqual(relatedTag.tag);
  });
});
