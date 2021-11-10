import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { createResultStub } from '../../../__stubs__/results-stubs.factory';
import { getDataTestSelector, installNewXPlugin } from '../../../__tests__/utils';
import { FeatureLocation } from '../../../types/origin';
import { XEvent } from '../../../wiring/events.types';
import BaseResultLink from '../base-result-link.vue';

describe('testing BaseResultLink component', () => {
  const result = createResultStub('Product 001', {
    images: ['https://picsum.photos/seed/1/200/300', 'https://picsum.photos/seed/2/200/300']
  });
  let localVue: typeof Vue;
  let resultLinkWrapper: Wrapper<BaseResultLink>;

  beforeEach(() => {
    [, localVue] = installNewXPlugin();
    resultLinkWrapper = mount(BaseResultLink, {
      localVue,
      propsData: { result }
    });
  });

  it('emits UserClickedAResult when the user click on the component', () => {
    const listener = jest.fn();
    resultLinkWrapper.vm.$x.on('UserClickedAResult').subscribe(listener);

    resultLinkWrapper.trigger('click');

    expect(listener).toHaveBeenCalledWith(result);
  });

  it('emits UserClickedAResult when the user middle click on the component', () => {
    const listener = jest.fn();
    resultLinkWrapper.vm.$x.on('UserClickedAResult').subscribe(listener);

    resultLinkWrapper.trigger('mouseup', { button: 1 });

    expect(listener).toHaveBeenCalledWith(result);
  });

  it('emits UserRightClickedAResult when the user right click on the component', () => {
    const listener = jest.fn();
    resultLinkWrapper.vm.$x.on('UserRightClickedAResult').subscribe(listener);

    resultLinkWrapper.trigger('contextmenu');
    expect(listener).toHaveBeenCalledWith(result);
  });

  it('emits events provided from parent element with provided location in metadata', () => {
    const listener = jest.fn();
    const resultLinkWrapper = mount(BaseResultLink, {
      provide: {
        resultClickExtraEvents: <XEvent[]>['UserClickedResultAddToCart'],
        location: <FeatureLocation>'no_query'
      },
      localVue,
      propsData: { result }
    });
    resultLinkWrapper.vm.$x.on('UserClickedResultAddToCart').subscribe(listener);
    resultLinkWrapper.trigger('click');
    expect(listener).toHaveBeenCalledWith(result);
  });

  it('renders the content overriding default slot', () => {
    const wrapperComponent = {
      template: `
        <BaseResultLink :result="result">
          <template #default="{ result }">
            <img  data-test="result-link-image" src="${result.images[0]}"/>
            <span data-test="result-link-text">
              {{ result.name }}
            </span>
          </template>
        </BaseResultLink>
      `,
      props: ['result'],
      components: {
        BaseResultLink
      }
    };

    const customResultLinkWrapper = mount(wrapperComponent, {
      localVue,
      propsData: { result }
    });
    expect(customResultLinkWrapper.find(getDataTestSelector('result-link')).element).toBeDefined();
    expect(
      customResultLinkWrapper.find(getDataTestSelector('result-link-image')).element
    ).toBeDefined();
    expect(
      customResultLinkWrapper.find(getDataTestSelector('result-link-image')).attributes('src')
    ).toEqual(result.images[0]);
    expect(customResultLinkWrapper.find(getDataTestSelector('result-link-text')).text()).toEqual(
      result.name
    );
  });
});
