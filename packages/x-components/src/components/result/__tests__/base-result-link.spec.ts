import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { Result } from '@empathyco/x-types';
import { createResultStub } from '../../../__stubs__/results-stubs.factory';
import { getDataTestSelector, installNewXPlugin } from '../../../__tests__/utils';
import { FeatureLocation } from '../../../types/origin';
import { XEvent, XEventsTypes } from '../../../wiring/events.types';
import BaseResultLink from '../base-result-link.vue';
import { WireMetadata } from '../../../wiring/index';
import { PropsWithType } from '../../../utils/index';

describe('testing BaseResultLink component', () => {
  const result = createResultStub('Product 001', {
    images: ['https://picsum.photos/seed/1/200/300', 'https://picsum.photos/seed/2/200/300']
  });
  let localVue: typeof Vue;
  let resultLinkWrapper: Wrapper<Vue>;
  const template = '<BaseResultLink :result="result"/>';

  beforeEach(() => {
    [, localVue] = installNewXPlugin();
    resultLinkWrapper = mount(
      {
        components: { BaseResultLink },
        props: ['result'],
        template
      },
      {
        localVue,
        propsData: { result }
      }
    );
  });

  // eslint-disable-next-line max-len
  it('emits UserClickedAResult when the user clicks in the left, middle or right button on the component', () => {
    const listener = jest.fn();
    resultLinkWrapper.vm.$x.on('UserClickedAResult').subscribe(listener);

    resultLinkWrapper.trigger('click');
    expect(listener).toHaveBeenNthCalledWith(1, result);

    resultLinkWrapper.trigger('click', { button: 1 });
    expect(listener).toHaveBeenNthCalledWith(2, result);

    resultLinkWrapper.trigger('click', { button: 2 });
    expect(listener).toHaveBeenNthCalledWith(3, result);

    expect(listener).toHaveBeenCalledTimes(3);
  });

  it('emits events provided from parent element with provided location in metadata', () => {
    const listener = jest.fn();
    const resultLinkWrapper = mount(
      {
        components: { BaseResultLink },
        props: ['result'],
        template
      },
      {
        provide: {
          resultClickExtraEvents: <XEvent[]>['UserClickedResultAddToCart'],
          location: <FeatureLocation>'no_query'
        },
        localVue,
        propsData: { result }
      }
    );
    resultLinkWrapper.vm.$x.on('UserClickedResultAddToCart', true).subscribe(listener);
    resultLinkWrapper.trigger('click');
    expect(listener).toHaveBeenCalledWith({
      eventPayload: result,
      metadata: expect.objectContaining({
        location: 'no_query'
      })
    });
  });

  it('emits events with the extra metadata provided from parent element', () => {
    const injectedResultLinkMetadataPerEvent: Partial<
      Record<
        PropsWithType<XEventsTypes, Result>,
        Omit<WireMetadata, 'moduleName' | 'origin' | 'location'>
      >
    > = {
      UserClickedAResult: {
        ignoreInModules: ['tagging']
      },
      UserClickedResultAddToCart: {
        replaceable: false
      }
    };
    const resultClickListener = jest.fn();
    const addToCartClickListener = jest.fn();

    const resultLinkWrapper = mount(
      {
        components: { BaseResultLink },
        props: ['result'],
        template
      },
      {
        provide: {
          resultClickExtraEvents: <XEvent[]>['UserClickedResultAddToCart'],
          resultLinkMetadataPerEvent: injectedResultLinkMetadataPerEvent
        },
        localVue,
        propsData: { result }
      }
    );
    resultLinkWrapper.vm.$x.on('UserClickedAResult', true).subscribe(resultClickListener);
    resultLinkWrapper.vm.$x
      .on('UserClickedResultAddToCart', true)
      .subscribe(addToCartClickListener);
    resultLinkWrapper.trigger('click');

    expect(resultClickListener).toHaveBeenCalledTimes(1);
    expect(resultClickListener).toHaveBeenCalledWith({
      eventPayload: result,
      metadata:
        expect.objectContaining(injectedResultLinkMetadataPerEvent.UserClickedAResult) &&
        expect.not.objectContaining(injectedResultLinkMetadataPerEvent.UserClickedResultAddToCart)
    });

    expect(addToCartClickListener).toHaveBeenCalledTimes(1);
    expect(addToCartClickListener).toHaveBeenCalledWith({
      eventPayload: result,
      metadata:
        expect.objectContaining(injectedResultLinkMetadataPerEvent.UserClickedResultAddToCart) &&
        expect.not.objectContaining(injectedResultLinkMetadataPerEvent.UserClickedAResult)
    });
  });

  it('renders the content overriding default slot', () => {
    const wrapperComponent = {
      template: `
        <BaseResultLink :result="result">
          <template #default="{ result }">
            <img data-test="result-link-image" src="${result.images![0]}"/>
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
    ).toEqual(result.images![0]);
    expect(customResultLinkWrapper.find(getDataTestSelector('result-link-text')).text()).toEqual(
      result.name
    );
  });
});
