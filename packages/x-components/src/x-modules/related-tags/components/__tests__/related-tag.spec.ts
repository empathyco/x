import { RelatedTag } from '@empathyco/x-types';
import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { XPlugin } from '../../../../plugins/x-plugin';
import { XComponentAPI } from '../../../../plugins/x-plugin.types';
import { RootXStoreState } from '../../../../store/store.types';
import { DeepPartial } from '../../../../utils/types';
import { getRelatedTagsStub } from '../../../../__stubs__/related-tags-stubs.factory';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import { relatedTagsXModule } from '../../x-module';
import RelatedTagComponent from '../related-tag.vue';

describe('testing related tag item component', () => {
  function renderRelatedTag({
    relatedTag = getRelatedTagsStub()[0],
    template = '<RelatedTag :relatedTag="relatedTag"/>'
  }: RenderRelatedTagOptions = {}): RenderRelatedTagsAPI {
    const localVue = createLocalVue();
    localVue.use(Vuex);
    const store = new Store<DeepPartial<RootXStoreState>>({});
    installNewXPlugin({ store }, localVue);
    // Manually re-installing the xModule
    XPlugin.registerXModule(relatedTagsXModule);

    const wrapperTemplate = mount(
      {
        props: ['relatedTag'],
        components: {
          RelatedTag: RelatedTagComponent
        },
        template
      },
      {
        localVue,
        store,
        propsData: { relatedTag }
      }
    );
    const wrapper = wrapperTemplate.findComponent(RelatedTagComponent);
    const $x = wrapperTemplate.vm.$x;

    return {
      wrapper,
      $x,
      relatedTag,
      async clickRelatedTag() {
        wrapper.trigger('click');
        await localVue.nextTick();
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
    const { wrapper, clickRelatedTag, relatedTag } = renderRelatedTag({
      template: `
        <RelatedTag :relatedTag="relatedTag">
          <template #default="{ relatedTag, isSelected }">
            <span data-test="related-tag-label">{{ relatedTag.tag }}</span>
            <img data-test="related-tag-cross" src="./cross-icon.svg" v-if="isSelected"/>
          </template>
        </RelatedTag>`
    });

    const relatedTagWrapper = wrapper.find(getDataTestSelector('related-tag'));
    const relatedTagLabelWrapper = wrapper.find(getDataTestSelector('related-tag-label'));
    let relatedTagCrossWrapper = wrapper.find(getDataTestSelector('related-tag-cross'));
    expect(relatedTagWrapper.exists()).toEqual(true);
    expect(relatedTagLabelWrapper.exists()).toEqual(true);
    expect(relatedTagLabelWrapper.text()).toEqual(relatedTag.tag);
    expect(relatedTagCrossWrapper.exists()).toEqual(false);

    await clickRelatedTag();
    relatedTagCrossWrapper = wrapper.find(getDataTestSelector('related-tag-cross'));

    expect(relatedTagCrossWrapper.exists()).toEqual(true);
  });

  // eslint-disable-next-line max-len
  it('emits UserSelectedARelatedTag, UserPickedARelatedTag andUserDeselectedARelatedTag when the related tag is clicked', async () => {
    const userPickedARelatedTagMock = jest.fn();
    const selectRelatedTagMock = jest.fn();
    const deselectRelatedTagMock = jest.fn();
    const { $x, clickRelatedTag, relatedTag } = renderRelatedTag();
    $x.on('UserPickedARelatedTag').subscribe(userPickedARelatedTagMock);
    $x.on('UserSelectedARelatedTag').subscribe(selectRelatedTagMock);
    $x.on('UserDeselectedARelatedTag').subscribe(deselectRelatedTagMock);

    await clickRelatedTag();

    expect(userPickedARelatedTagMock).toHaveBeenCalledTimes(1);
    expect(userPickedARelatedTagMock).toHaveBeenNthCalledWith(1, relatedTag);
    expect(selectRelatedTagMock).toHaveBeenCalledTimes(1);
    expect(selectRelatedTagMock).toHaveBeenNthCalledWith(1, relatedTag);

    await clickRelatedTag();

    expect(userPickedARelatedTagMock).toHaveBeenCalledTimes(2);
    expect(userPickedARelatedTagMock).toHaveBeenNthCalledWith(2, relatedTag);
    expect(deselectRelatedTagMock).toHaveBeenCalledTimes(1);
    expect(deselectRelatedTagMock).toHaveBeenNthCalledWith(1, relatedTag);
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
  wrapper: Wrapper<Vue>;
  /** The {@link XComponentAPI} used by the rendered {@link RelatedTagComponent}. */
  $x: XComponentAPI;
  /** The rendered related tag data. */
  relatedTag: RelatedTag;
  /** Clicks the related tag and waits for the view to update. */
  clickRelatedTag: () => Promise<void>;
}
