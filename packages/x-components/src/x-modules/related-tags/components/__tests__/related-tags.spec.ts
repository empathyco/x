import { RelatedTag } from '@empathyco/x-types';
import { DeepPartial } from '@empathyco/x-utils';
import { DOMWrapper, mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { Store } from 'vuex';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { XPlugin } from '../../../../plugins/x-plugin';
import { RootXStoreState } from '../../../../store/store.types';
import { getRelatedTagsStub } from '../../../../__stubs__/related-tags-stubs.factory';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import { relatedTagsXModule } from '../../x-module';
import RelatedTagComponent from '../related-tag.vue';
import RelatedTags from '../related-tags.vue';
import { resetStoreRelatedTagsState } from './utils';

describe('testing related tags component', () => {
  function renderRelatedTags({
    relatedTags = getRelatedTagsStub(),
    template = '<RelatedTags v-bind="$attrs" />',
    itemClass,
    highlightCurated
  }: RenderRelatedTagsOptions = {}) {
    const store = new Store<DeepPartial<RootXStoreState>>({});

    const wrapperTemplate = mount(
      {
        props: ['relatedTags', 'highlightCurated'],
        components: {
          RelatedTags
        },
        template
      },
      {
        global: {
          plugins: [installNewXPlugin({ store, initialXModules: [relatedTagsXModule] })]
        },
        store,
        props: { relatedTags, itemClass, highlightCurated }
      }
    );
    // Manually re-installing the xModule and updating its state
    XPlugin.registerXModule(relatedTagsXModule);
    resetStoreRelatedTagsState(store, { relatedTags });
    const wrapper = wrapperTemplate.findComponent(RelatedTags);

    return {
      wrapper,
      wrapperTemplate,
      relatedTags,
      getRelatedTagItems() {
        return wrapper.findAll(getDataTestSelector('related-tag-item'));
      },
      async clickNthRelatedTag(nth: number) {
        const relatedTagWrappers = wrapper.findAllComponents(RelatedTagComponent);
        const targetRelatedTagWrapper = relatedTagWrappers[nth];
        targetRelatedTagWrapper.trigger('click');
        await nextTick();
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

    expect(wrapper.text()).toEqual('');
  });

  it('renders a list of the related tags', () => {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { relatedTags, getRelatedTagItems } = renderRelatedTags();

    getRelatedTagItems().forEach((relatedTagItemWrapper, index) => {
      expect(relatedTagItemWrapper.text()).toEqual(relatedTags[index].tag);
    });
  });

  it('allows to add classes to each related tag', () => {
    const { wrapper } = renderRelatedTags({ itemClass: 'custom-class' });
    const relatedTagWrappers = wrapper.findAllComponents(RelatedTagComponent);

    relatedTagWrappers.forEach(relatedTagItemWrapper => {
      expect(relatedTagItemWrapper.classes('custom-class')).toBe(true);
    });
  });

  it('allows changing the content of each related tag', async () => {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { relatedTags, clickNthRelatedTag, getRelatedTagItems, wrapperTemplate } =
      renderRelatedTags({
        template: `
        <RelatedTags>
          <template #related-tag-content="{relatedTag, isSelected, shouldHighlightCurated }">
            <img
              data-test="related-tag-chevron"
              src="./chevron-icon.svg"
              v-if="shouldHighlightCurated"
            />
            <span data-test="related-tag-label">{{ relatedTag.tag }}</span>
            <img data-test="related-tag-cross" src="./cross-icon.svg" v-if="isSelected"/>
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

    await nextTick();
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
    await wrapperTemplate.setProps({ highlightCurated: true });
    await nextTick();
    relatedTagsWrappers = getRelatedTagItems();
    const chevron = relatedTagsWrappers[0].find(getDataTestSelector('related-tag-chevron'));
    expect(chevron.exists()).toEqual(true);
  });

  it('allows changing the whole component for each related tag', async () => {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { getRelatedTagItems, relatedTags, wrapperTemplate } = renderRelatedTags({
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
      expect(customRelatedTagWrapper.exists()).toEqual(false);
    });

    await wrapperTemplate.setProps({ highlightCurated: true });

    relatedTagsWrappers.forEach((relatedTagItemWrapper, index) => {
      const customRelatedTagWrapper = relatedTagItemWrapper.find(
        getDataTestSelector('custom-related-tag')
      );
      expect(customRelatedTagWrapper.exists()).toEqual(true);
      expect(customRelatedTagWrapper.text()).toEqual(relatedTags[index].tag);
    });
  });

  it('renders a list of related tags which length is, at most, maxItemsToRender', async () => {
    const maxItemsToRender = 2;
    const { wrapper, relatedTags } = renderRelatedTags({
      template: `<RelatedTags maxItemsToRender=${maxItemsToRender} />`
    });
    await nextTick();
    const relatedTagsWrappers = wrapper.findAll(getDataTestSelector('related-tag-item'));
    expect(relatedTags.length).toBeGreaterThan(maxItemsToRender);
    expect(relatedTagsWrappers).toHaveLength(maxItemsToRender);
  });
});

interface RenderRelatedTagsOptions {
  /** The initial related tags to render. */
  relatedTags?: RelatedTag[];
  /**
   * The template to render. Receives the `relatedTags` via prop, and has registered the
   * {@link RelatedTags} component.
   */
  template?: string;
  /** Class to add to the related tags. */
  itemClass?: string;
  /** Flag to indicate if the curated tags should be displayed different. */
  highlightCurated?: boolean;
}
