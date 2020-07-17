import { createLocalVue, mount, Wrapper, WrapperArray } from '@vue/test-utils';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { RootXStoreState } from '../../../../store/store.types';
import { DeepPartial } from '../../../../utils/types';
import { getRelatedTagsStub } from '../../../../__stubs__/related-tags-stubs.factory';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import RelatedTag from '../related-tag.vue';
import RelatedTags from '../related-tags.vue';
import { resetStoreRelatedTagsState } from './utils';

describe('testing related tags component', () => {
  const relatedTags = getRelatedTagsStub();

  const localVue = createLocalVue();
  localVue.use(Vuex);

  const store = new Store<DeepPartial<RootXStoreState>>({});
  installNewXPlugin({ store }, localVue);

  let relatedTagsWrapper: Wrapper<Vue>;

  beforeEach(() => {
    relatedTagsWrapper = mount(RelatedTags, { localVue, store });
    resetStoreRelatedTagsState(store, { relatedTags });
  });

  it('is an XComponent', () => {
    expect(isXComponent(relatedTagsWrapper.vm)).toEqual(true);
    expect(getXComponentXModuleName(relatedTagsWrapper.vm)).toBe('relatedTags');
  });

  it('renders a button with the query of the related tag', () => {
    const eventButtonsList = findTestDataById(relatedTagsWrapper, 'related-tag');

    relatedTags.forEach((relatedTag, index) => {
      expect(eventButtonsList.at(index).element.innerHTML).toEqual(relatedTag.tag);
    });
  });

  it('renders a span & and image overriding the default Related Tag content', () => {
    const wrapperComponent = {
      template: `
        <RelatedTags>
          <template #related-tag-content="{relatedTag}">
            <img src="./related-tag-icon.svg" class="x-related-tag__icon" data-test="icon"/>
            <span class="x-related-tag__tag" data-test="tag">{{ relatedTag.tag }}</span>
          </template>
        </RelatedTags>`,
      components: {
        RelatedTags
      }
    };

    relatedTagsWrapper = mount(wrapperComponent, {
      localVue,
      store
    });

    const eventSpansList = findTestDataById(relatedTagsWrapper, 'tag');
    const iconsList = findTestDataById(relatedTagsWrapper, 'icon');

    relatedTags.forEach((relatedTag, index) => {
      expect(eventSpansList.at(index).element.innerHTML).toEqual(relatedTag.tag);
      expect(iconsList.at(index)).toBeDefined();
    });
  });

  it('renders a button & a custom Related Tag', () => {
    const wrapperComponent = {
      template: `
        <RelatedTags>
          <template #related-tag="{relatedTag}">
            <RelatedTag :relatedTag="relatedTag">
              <template #default>
                <img src="./related-tag-icon.svg"
                     class="x-related-tag__icon"
                     data-test="icon"/>
                <span class="x-related-tag__tag"
                      data-test="tag">{{ relatedTag.tag }}</span>
              </template>
            </RelatedTag>
              <button data-test="custom-button">Custom Behaviour</button>
          </template>
        </RelatedTags>
      `,
      components: {
        RelatedTags,
        RelatedTag
      }
    };

    relatedTagsWrapper = mount(wrapperComponent, {
      localVue,
      store
    });

    expect(relatedTagsWrapper.findComponent(RelatedTag)).toBeDefined();

    const eventSpansList = findTestDataById(relatedTagsWrapper, 'tag');
    const iconsList = findTestDataById(relatedTagsWrapper, 'icon');
    const customButtonList = findTestDataById(relatedTagsWrapper, 'custom-button');

    relatedTags.forEach((relatedTag, index) => {
      expect(eventSpansList.at(index).element.innerHTML).toEqual(relatedTag.tag);
      expect(iconsList.at(index)).toBeDefined();
      expect(customButtonList.at(index)).toBeDefined();
    });
  });

  it('does not render any Related Tag if the are none', async () => {
    resetStoreRelatedTagsState(store);

    await localVue.nextTick();

    expect(relatedTagsWrapper.html()).toEqual('');
  });

  function findTestDataById(wrapper: Wrapper<Vue>, testDataId: string): WrapperArray<Vue> {
    return wrapper.findAll(getDataTestSelector(testDataId));
  }
});
