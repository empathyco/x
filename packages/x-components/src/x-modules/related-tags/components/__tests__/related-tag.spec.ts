import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { getXComponentXModuleName, isXComponent } from '../../../../components';
import { getRelatedTagsStub } from '../../../../__stubs__';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import { WireMetadata } from '../../../../wiring';
import { relatedTagsXModule } from '../../x-module';
import RelatedTag from '../related-tag.vue';
import { XPlugin } from '../../../../plugins';

describe('testing related tag item component', () => {
  function renderRelatedTag({
    relatedTag = getRelatedTagsStub()[0],
    template = '<RelatedTag :relatedTag="relatedTag" />'
  } = {}) {
    const wrapper = mount(
      {
        components: { RelatedTag },
        template
      },
      {
        global: { plugins: [installNewXPlugin({ initialXModules: [relatedTagsXModule] })] },
        props: { relatedTag, highlightCurated: false }
      }
    );
    const wrapperRelatedTag = wrapper.findComponent(RelatedTag);

    return {
      wrapper,
      wrapperRelatedTag,
      relatedTag,
      clickRelatedTag: async () => {
        await wrapper.trigger('click');
      }
    };
  }

  it('is an XComponent and has an XModule', () => {
    const { wrapperRelatedTag } = renderRelatedTag();
    expect(isXComponent(wrapperRelatedTag.vm)).toBeTruthy();
    expect(getXComponentXModuleName(wrapperRelatedTag.vm)).toEqual('relatedTags');
  });

  it('renders a button with the tag of the related tag', () => {
    const { wrapperRelatedTag, relatedTag } = renderRelatedTag();
    const relatedTagItem = wrapperRelatedTag.find(getDataTestSelector('related-tag'));
    expect(relatedTagItem.text()).toEqual(relatedTag.tag);
  });

  it('allows changing the rendered content with a slot', async () => {
    const { wrapper, wrapperRelatedTag, clickRelatedTag, relatedTag } = renderRelatedTag({
      template: `
        <RelatedTag :relatedTag="relatedTag">
          <template #default="{ relatedTag, isSelected, shouldHighlightCurated }">
            <img
              data-test="related-tag-chevron"
              src="./chevron-icon.svg"
              v-if="shouldHighlightCurated"
             alt=""/>
            <span data-test="related-tag-label">{{ relatedTag.tag }}</span>
            <img class="x-related-tag-cross" data-test="related-tag-cross" src="./cross-icon.svg" v-if="isSelected" alt=""/>
          </template>
        </RelatedTag>`
    });

    const relatedTagWrapper = wrapper.find(getDataTestSelector('related-tag'));
    let relatedTagChevronWrapper = wrapper.find(getDataTestSelector('related-tag-chevron'));
    const relatedTagLabelWrapper = wrapper.find(getDataTestSelector('related-tag-label'));
    let relatedTagCrossWrapper = wrapper.find(getDataTestSelector('related-tag-cross'));

    expect(relatedTagWrapper.exists()).toBeTruthy();
    expect(relatedTagLabelWrapper.exists()).toBeTruthy();
    expect(relatedTagChevronWrapper.exists()).toBeFalsy();
    expect(relatedTagLabelWrapper.text()).toEqual(relatedTag.tag);
    expect(relatedTagCrossWrapper.exists()).toBeFalsy();

    await clickRelatedTag();

    relatedTagCrossWrapper = wrapper.find(getDataTestSelector('related-tag-cross'));
    expect(relatedTagCrossWrapper.exists()).toBeTruthy();

    await wrapper.setProps({ highlightCurated: true } as any);
    await nextTick();

    relatedTagChevronWrapper = wrapperRelatedTag.find('.x-related-tag-cross');

    expect(relatedTagChevronWrapper.exists()).toBeTruthy();
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
