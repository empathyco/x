import { RelatedTag } from '@empathyco/x-types';
import { createLocalVue, mount, Wrapper, WrapperArray } from '@vue/test-utils';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { XPlugin } from '../../../../plugins/x-plugin';
import { RootXStoreState } from '../../../../store/store.types';
import { DeepPartial } from '../../../../utils/types';
import { getRelatedTagsStub } from '../../../../__stubs__/related-tags-stubs.factory';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import { relatedTagsXModule } from '../../x-module';
import RelatedTagComponent from '../related-tag.vue';
import RelatedTags from '../related-tags.vue';
import { resetStoreRelatedTagsState } from './utils';

describe('testing related tags component', () => {
  function renderRelatedTags({
    relatedTags = getRelatedTagsStub(),
    template = '<RelatedTags />'
  }: RenderRelatedTagsOptions = {}): RenderRelatedTagsAPI {
    const localVue = createLocalVue();
    localVue.use(Vuex);
    const store = new Store<DeepPartial<RootXStoreState>>({});
    installNewXPlugin({ store }, localVue);

    // Manually re-installing the xModule and updting its state
    XPlugin.registerXModule(relatedTagsXModule);
    resetStoreRelatedTagsState(store, { relatedTags });

    const wrapperTemplate = mount(
      {
        props: ['relatedTags'],
        components: {
          RelatedTags: RelatedTags
        },
        template
      },
      {
        localVue,
        store,
        propsData: { relatedTags }
      }
    );
    const wrapper = wrapperTemplate.findComponent(RelatedTags);

    return {
      wrapper,
      relatedTags,
      getRelatedTagItems() {
        return wrapper.findAll(getDataTestSelector('related-tag-item'));
      },
      async clickNthRelatedTag(nth) {
        const relatedTagWrappers = wrapper.findAllComponents(RelatedTagComponent);
        const targetRelatedTagWrapper = relatedTagWrappers.wrappers[nth];
        targetRelatedTagWrapper.trigger('click');
        await localVue.nextTick();
      }
    };
  }

  it('is an XComponent', () => {
    const { wrapper } = renderRelatedTags();

    expect(isXComponent(wrapper.vm)).toEqual(true);
    expect(getXComponentXModuleName(wrapper.vm)).toBe('relatedTags');
  });

  it('does not render anything if there are not related tags', () => {
    const { wrapper } = renderRelatedTags({ relatedTags: [] });

    expect(wrapper.html()).toEqual('');
  });

  it('renders a list of the related tags', () => {
    const { wrapper, relatedTags } = renderRelatedTags();

    const relatedTagsWrappers = wrapper.findAll(getDataTestSelector('related-tag-item'));

    relatedTagsWrappers.wrappers.forEach((relatedTagItemWrapper, index) => {
      expect(relatedTagItemWrapper.text()).toEqual(relatedTags[index].tag);
    });
  });

  it('allows changing the content of each related tag', async () => {
    const { relatedTags, clickNthRelatedTag, getRelatedTagItems } = renderRelatedTags({
      template: `
        <RelatedTags>
          <template #related-tag-content="{relatedTag, isSelected }">
            <span data-test="related-tag-label">{{ relatedTag.tag }}</span>
            <img data-test="related-tag-cross" src="./cross-icon.svg" v-if="isSelected"/>
          </template>
        </RelatedTags>`
    });

    function expectToHaveOverriddenContent(
      relatedTagItemWrapper: Wrapper<Vue>,
      index: number
    ): void {
      const labelWrapper = relatedTagItemWrapper.find(getDataTestSelector('related-tag-label'));
      const crossWrapper = relatedTagItemWrapper.find(getDataTestSelector('related-tag-cross'));
      expect(labelWrapper.text()).toEqual(relatedTags[index].tag);
      expect(crossWrapper.exists()).toEqual(false);
    }

    let relatedTagsWrappers = getRelatedTagItems();
    relatedTagsWrappers.wrappers.forEach(expectToHaveOverriddenContent);

    await clickNthRelatedTag(relatedTags.length - 1);
    relatedTagsWrappers = getRelatedTagItems();

    const [selectedWrapper, ...unSelectedWrappers] = relatedTagsWrappers.wrappers;
    const labelWrapper = selectedWrapper.find(getDataTestSelector('related-tag-label'));
    const crossWrapper = selectedWrapper.find(getDataTestSelector('related-tag-cross'));
    expect(labelWrapper.text()).toEqual(relatedTags[relatedTags.length - 1].tag);
    expect(crossWrapper.exists()).toEqual(true);
    unSelectedWrappers.forEach(expectToHaveOverriddenContent);
  });

  it('allows changing the whole component for each related tag', () => {
    const { getRelatedTagItems, relatedTags } = renderRelatedTags({
      template: `
        <RelatedTags>
          <template #related-tag="{relatedTag}">
            <button data-test="custom-related-tag">
              {{ relatedTag.tag }}
            </button>
          </template>
        </RelatedTags>`
    });

    const relatedTagsWrappers = getRelatedTagItems();

    relatedTagsWrappers.wrappers.forEach((relatedTagItemWrapper, index) => {
      const customRelatedTagWrapper = relatedTagItemWrapper.find(
        getDataTestSelector('custom-related-tag')
      );
      expect(customRelatedTagWrapper.exists()).toEqual(true);
      expect(customRelatedTagWrapper.text()).toEqual(relatedTags[index].tag);
    });
  });

  it('renders a list of related tags which length is, at most, maxItemsToRender', () => {
    const maxItemsToRender = 2;
    const { wrapper, relatedTags } = renderRelatedTags({
      template: `<RelatedTags maxItemsToRender=${maxItemsToRender} />`
    });

    const relatedTagsWrappers = wrapper.findAll(getDataTestSelector('related-tag-item'));
    expect(relatedTags.length).toBeGreaterThan(maxItemsToRender);
    expect(relatedTagsWrappers).toHaveLength(maxItemsToRender);
  });
});

interface RenderRelatedTagsOptions {
  /** The initial related tags to render. */
  relatedTags?: RelatedTag[];
  /** The template to render. Receives the `relatedTags` via prop, and has registered the
   * {@link RelatedTags} component. */
  template?: string;
}

interface RenderRelatedTagsAPI {
  /** The Vue testing utils wrapper for the  {@link RelatedTags} component. */
  wrapper: Wrapper<Vue>;
  /** The initial list of related tags that are going to be rendered. */
  relatedTags: RelatedTag[];
  /** Retrieves the wrapper for the items of the list rendered by the {@link RelatedTags}
   * component. */
  getRelatedTagItems: () => WrapperArray<Vue>;
  /** Clicks the nth {@link RelatedTagComponent} component and waits for the view to update. */
  clickNthRelatedTag: (nth: number) => Promise<void>;
}
