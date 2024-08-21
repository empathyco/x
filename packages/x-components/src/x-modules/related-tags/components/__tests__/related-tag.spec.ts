import { RelatedTag } from '@empathyco/x-types';
import { DeepPartial } from '@empathyco/x-utils';
import { mount, VueWrapper } from '@vue/test-utils';
import { nextTick } from 'vue';
import { Store } from 'vuex';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { XComponentAPI } from '../../../../plugins/x-plugin.types';
import { RootXStoreState } from '../../../../store/store.types';
import { getRelatedTagsStub } from '../../../../__stubs__/related-tags-stubs.factory';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import { WireMetadata } from '../../../../wiring/wiring.types';
import { relatedTagsXModule } from '../../x-module';
import RelatedTagComponent from '../related-tag.vue';
import { XPlugin } from '../../../../plugins/x-plugin';

describe('testing related tag item component', () => {
  function renderRelatedTag({
    relatedTag = getRelatedTagsStub()[0],
    template = '<RelatedTag :relatedTag="relatedTag" />'
  }: RenderRelatedTagOptions = {}): RenderRelatedTagsAPI {
    const store = new Store<DeepPartial<RootXStoreState>>({});
    installNewXPlugin({ store });
    // Manually re-installing the xModule
    XPlugin.registerXModule(relatedTagsXModule);

    const wrapperTemplate = mount(
      {
        props: ['relatedTag', 'highlightCurated'],
        components: {
          RelatedTag: RelatedTagComponent
        },
        template
      },
      {
        store,
        global: { plugins: [installNewXPlugin()] },
        props: { relatedTag }
      }
    );
    const wrapper = wrapperTemplate.findComponent(RelatedTagComponent);

    return {
      wrapper,
      wrapperTemplate,
      relatedTag,
      async clickRelatedTag() {
        wrapper.trigger('click');
        await nextTick();
      }
    };
  }

  it('is an XComponent and has an XModule', () => {
    const { wrapper } = renderRelatedTag();
    expect(isXComponent(wrapper.vm)).toEqual(true);
    expect(getXComponentXModuleName(wrapper.vm)).toBe('relatedTags');
  });

  it('renders a button with the tag of the related tag', () => {
    const { wrapper, relatedTag } = renderRelatedTag();
    const relatedTagItem = wrapper.find(getDataTestSelector('related-tag'));
    expect(relatedTagItem.text()).toEqual(relatedTag.tag);
  });

  it('allows changing the rendered content with a slot', async () => {
    const { wrapperTemplate, wrapper, clickRelatedTag, relatedTag } = renderRelatedTag({
      template: `
        <RelatedTag :relatedTag="relatedTag">
          <template #default="{ relatedTag, isSelected, shouldHighlightCurated }">
            <img
              data-test="related-tag-chevron"
              src="./chevron-icon.svg"
              v-if="shouldHighlightCurated"
            />
            <span data-test="related-tag-label">{{ relatedTag.tag }}</span>
            <img class="x-related-tag-cross" data-test="related-tag-cross" src="./cross-icon.svg" v-if="isSelected"/>
          </template>
        </RelatedTag>`
    });

    const relatedTagWrapper = wrapper.find(getDataTestSelector('related-tag'));
    let relatedTagChevronWrapper = wrapper.find(getDataTestSelector('related-tag-chevron'));
    const relatedTagLabelWrapper = wrapper.find(getDataTestSelector('related-tag-label'));
    let relatedTagCrossWrapper = wrapper.find(getDataTestSelector('related-tag-cross'));

    expect(relatedTagWrapper.exists()).toBe(true);
    expect(relatedTagLabelWrapper.exists()).toBe(true);
    expect(relatedTagChevronWrapper.exists()).toBe(false);
    expect(relatedTagLabelWrapper.text()).toBe(relatedTag.tag);
    expect(relatedTagCrossWrapper.exists()).toBe(false);

    await clickRelatedTag();

    relatedTagCrossWrapper = wrapper.find(getDataTestSelector('related-tag-cross'));
    expect(relatedTagCrossWrapper.exists()).toBe(true);

    await wrapperTemplate.setProps({ highlightCurated: true });
    await nextTick();

    relatedTagChevronWrapper = wrapperTemplate.find('.x-related-tag-cross');

    expect(relatedTagChevronWrapper.exists()).toBe(true);
  });

  // eslint-disable-next-line max-len
  it('emits UserSelectedARelatedTag, UserPickedARelatedTag andUserDeselectedARelatedTag when the related tag is clicked', async () => {
    const userPickedARelatedTagMock = jest.fn();
    const selectRelatedTagMock = jest.fn();
    const deselectRelatedTagMock = jest.fn();
    const { clickRelatedTag, relatedTag, wrapper } = renderRelatedTag();
    const expectedMetadata: Partial<WireMetadata> = {
      target: wrapper.element,
      feature: 'related_tag'
    };
    XPlugin.bus.on('UserPickedARelatedTag', true).subscribe(userPickedARelatedTagMock);
    XPlugin.bus.on('UserSelectedARelatedTag', true).subscribe(selectRelatedTagMock);
    XPlugin.bus.on('UserDeselectedARelatedTag', true).subscribe(deselectRelatedTagMock);

    await clickRelatedTag();

    expect(userPickedARelatedTagMock).toHaveBeenCalledTimes(1);
    expect(userPickedARelatedTagMock).toHaveBeenNthCalledWith(1, {
      eventPayload: relatedTag,
      metadata: expect.objectContaining(expectedMetadata)
    });
    expect(selectRelatedTagMock).toHaveBeenCalledTimes(1);
    expect(selectRelatedTagMock).toHaveBeenNthCalledWith(1, {
      eventPayload: relatedTag,
      metadata: expect.objectContaining(expectedMetadata)
    });

    await clickRelatedTag();

    expect(userPickedARelatedTagMock).toHaveBeenCalledTimes(2);
    expect(userPickedARelatedTagMock).toHaveBeenNthCalledWith(2, {
      eventPayload: relatedTag,
      metadata: expect.objectContaining(expectedMetadata)
    });
    expect(deselectRelatedTagMock).toHaveBeenCalledTimes(1);
    expect(deselectRelatedTagMock).toHaveBeenNthCalledWith(1, {
      eventPayload: relatedTag,
      metadata: expect.objectContaining(expectedMetadata)
    });
  });
});

interface RenderRelatedTagOptions {
  /** The related tag data to render. */
  relatedTag?: RelatedTag;
  /** The template to render. Receives the `relatedTag` via prop, and has registered the
   * {@link RelatedTagComponent} as `RelatedTag`. */
  template?: string;
}

interface RenderRelatedTagsAPI {
  /** The Vue testing utils wrapper for the {@link RelatedTagComponent}. */
  wrapper: VueWrapper;
  /** The rendered related tag data. */
  relatedTag: RelatedTag;
  /** Clicks the related tag and waits for the view to update. */
  clickRelatedTag: () => Promise<void>;
  wrapperTemplate: VueWrapper;
}
