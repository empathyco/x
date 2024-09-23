import { DeepPartial } from '@empathyco/x-utils';
import { DOMWrapper, mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { Store } from 'vuex';
import { getXComponentXModuleName, isXComponent } from '../../../../components';
import { RootXStoreState } from '../../../../store';
import { getRelatedTagsStub } from '../../../../__stubs__';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import { relatedTagsXModule } from '../../x-module';
import RelatedTagComponent from '../related-tag.vue';
import RelatedTags from '../related-tags.vue';
import { resetStoreRelatedTagsState } from './utils';

async function renderRelatedTags({
  relatedTags = getRelatedTagsStub(),
  template = '<RelatedTags :itemClass="itemClass" :highlightCurated="highlightCurated" />',
  itemClass = ''
} = {}) {
  const store = new Store<DeepPartial<RootXStoreState>>({});

  const wrapper = mount(
    {
      components: { RelatedTags },
      template
    },
    {
      props: { itemClass, highlightCurated: false },
      global: { plugins: [installNewXPlugin({ store, initialXModules: [relatedTagsXModule] })] }
    }
  );

  resetStoreRelatedTagsState(store, { relatedTags });
  await nextTick();

  return {
    wrapper,
    relatedTagsWrapper: wrapper.findComponent(RelatedTags),
    relatedTags,
    getRelatedTagItems: () => wrapper.findAll(getDataTestSelector('related-tag-item')),
    clickNthRelatedTag: async (nth: number) => {
      const relatedTagWrappers = wrapper.findAllComponents(RelatedTagComponent);
      const targetRelatedTagWrapper = relatedTagWrappers[nth];
      await targetRelatedTagWrapper.trigger('click');
    }
  };
}

describe('testing related tags component', () => {
  it('is an XComponent', async () => {
    const { relatedTagsWrapper } = await renderRelatedTags();

    expect(isXComponent(relatedTagsWrapper.vm)).toEqual(true);
    expect(getXComponentXModuleName(relatedTagsWrapper.vm)).toEqual('relatedTags');
  });

  it('does not render anything if there are not related tags', async () => {
    const { relatedTagsWrapper } = await renderRelatedTags({ relatedTags: [] });

    expect(relatedTagsWrapper.isVisible()).toBeFalsy();
  });

  it('renders a list of the related tags', async () => {
    const { relatedTags, getRelatedTagItems } = await renderRelatedTags();

    getRelatedTagItems().forEach((relatedTagItemWrapper, index) => {
      expect(relatedTagItemWrapper.text()).toEqual(relatedTags[index].tag);
    });
  });

  it('allows to add classes to each related tag', async () => {
    const { relatedTagsWrapper } = await renderRelatedTags({ itemClass: 'custom-class' });
    const relatedTagWrappers = relatedTagsWrapper.findAllComponents(RelatedTagComponent);

    relatedTagWrappers.forEach(relatedTagItemWrapper => {
      expect(relatedTagItemWrapper.classes('custom-class')).toBeTruthy();
    });
  });

  it('allows changing the content of each related tag', async () => {
    const { relatedTags, clickNthRelatedTag, getRelatedTagItems, wrapper } =
      await renderRelatedTags({
        template: `
          <RelatedTags>
            <template #related-tag-content="{relatedTag, isSelected, shouldHighlightCurated }">
              <img
                data-test="related-tag-chevron"
                src="#"
                v-if="shouldHighlightCurated"
                alt="" />
              <span data-test="related-tag-label">{{ relatedTag.tag }}</span>
              <img data-test="related-tag-cross" src="#" v-if="isSelected" alt=""/>
            </template>
          </RelatedTags>`
      });

    function expectToHaveOverriddenContent(
      relatedTagItemWrapper: DOMWrapper<Element>,
      index: number
    ): void {
      const labelWrapper = relatedTagItemWrapper.find(getDataTestSelector('related-tag-label'));
      const crossWrapper = relatedTagItemWrapper.find(getDataTestSelector('related-tag-cross'));
      const chevronWrapper = relatedTagItemWrapper.find(getDataTestSelector('related-tag-chevron'));
      expect(labelWrapper.text()).toEqual(relatedTags[index].tag);
      expect(crossWrapper.exists()).toEqual(false);
      expect(chevronWrapper.exists()).toEqual(false);
    }

    let relatedTagsWrappers = getRelatedTagItems();
    relatedTagsWrappers.forEach(expectToHaveOverriddenContent);

    await clickNthRelatedTag(relatedTags.length - 1);
    relatedTagsWrappers = getRelatedTagItems();

    const [selectedWrapper, ...unSelectedWrappers] = relatedTagsWrappers;
    const labelWrapper = selectedWrapper.find(getDataTestSelector('related-tag-label'));
    const crossWrapper = selectedWrapper.find(getDataTestSelector('related-tag-cross'));
    expect(labelWrapper.text()).toEqual(relatedTags[relatedTags.length - 1].tag);
    expect(crossWrapper.exists()).toEqual(true);
    unSelectedWrappers.forEach(expectToHaveOverriddenContent);

    relatedTags[relatedTags.length - 1].isCurated = true;
    await wrapper.setProps({ highlightCurated: true } as any);
    relatedTagsWrappers = getRelatedTagItems();
    const chevron = relatedTagsWrappers[0].find(getDataTestSelector('related-tag-chevron'));
    expect(chevron.exists()).toEqual(true);
  });

  it('allows changing the whole component for each related tag', async () => {
    const { getRelatedTagItems, relatedTags, wrapper } = await renderRelatedTags({
      template: `
        <RelatedTags>
          <template #related-tag="{relatedTag, highlightCurated }">
            <button data-test="custom-related-tag" v-if="highlightCurated">
              {{ relatedTag.tag }}
            </button>
          </template>
        </RelatedTags>`
    });

    const relatedTagsWrappers = getRelatedTagItems();

    relatedTagsWrappers.forEach(relatedTagItemWrapper => {
      const customRelatedTagWrapper = relatedTagItemWrapper.find(
        getDataTestSelector('custom-related-tag')
      );
      expect(customRelatedTagWrapper.exists()).toBeFalsy();
    });

    await wrapper.setProps({ highlightCurated: true } as any);

    relatedTagsWrappers.forEach((relatedTagItemWrapper, index) => {
      const customRelatedTagWrapper = relatedTagItemWrapper.find(
        getDataTestSelector('custom-related-tag')
      );
      expect(customRelatedTagWrapper.exists()).toBeTruthy();
      expect(customRelatedTagWrapper.text()).toEqual(relatedTags[index].tag);
    });
  });

  it('renders a list of related tags which length is, at most, maxItemsToRender', async () => {
    const maxItemsToRender = 2;
    const { wrapper, relatedTags } = await renderRelatedTags({
      template: `<RelatedTags maxItemsToRender=${maxItemsToRender} />`
    });

    const relatedTagsWrappers = wrapper.findAll(getDataTestSelector('related-tag-item'));
    expect(relatedTags.length).toBeGreaterThan(maxItemsToRender);
    expect(relatedTagsWrappers).toHaveLength(maxItemsToRender);
  });
});
