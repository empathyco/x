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
import { bus } from '../../../plugins/index';
import { dummyCreateEmitter } from '../../../__tests__/bus.dummy';

describe('testing BaseResultLink component', () => {
  const result = createResultStub('Product 001', {
    images: ['https://picsum.photos/seed/1/200/300', 'https://picsum.photos/seed/2/200/300']
  });
  let localVue: typeof Vue;
  let resultLinkWrapper: Wrapper<Vue>;
  const template = '<BaseResultLink :result="result"/>';
  // Making bus not repeat subjects
  jest.spyOn(bus, 'createEmitter' as any).mockImplementation(dummyCreateEmitter.bind(bus) as any);

  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(() => {
    [, localVue] = installNewXPlugin(undefined, undefined, bus);
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
  it('emits UserClickedAResult when the user clicks in the left, middle or right button on the component', async () => {
    const listener = jest.fn();
    bus.on('UserClickedAResult').subscribe(listener);

    await resultLinkWrapper.trigger('click');
    jest.runAllTimers();
    expect(listener).toHaveBeenNthCalledWith(1, result);

    await resultLinkWrapper.trigger('click', { button: 1 });
    jest.runAllTimers();
    expect(listener).toHaveBeenNthCalledWith(2, result);

    await resultLinkWrapper.trigger('click', { button: 2 });
    jest.runAllTimers();
    expect(listener).toHaveBeenNthCalledWith(3, result);

    expect(listener).toHaveBeenCalledTimes(3);
  });

  it('emits events provided from parent element with provided location in metadata', async () => {
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

    const listener = jest.fn();
    bus.on('UserClickedResultAddToCart', true).subscribe(listener);

    await resultLinkWrapper.trigger('click');
    jest.runAllTimers();

    expect(listener).toHaveBeenCalledWith({
      eventPayload: result,
      metadata: expect.objectContaining({
        location: 'no_query'
      })
    });
  });

  it('emits events with the extra metadata provided from parent element', async () => {
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

    const resultClickListener = jest.fn();
    bus.on('UserClickedAResult', true).subscribe(resultClickListener);

    const addToCartClickListener = jest.fn();
    bus.on('UserClickedResultAddToCart', true).subscribe(addToCartClickListener);

    await resultLinkWrapper.trigger('click');
    jest.runAllTimers();

    expect(resultClickListener).toHaveBeenCalledTimes(1);
    expect(resultClickListener).toHaveBeenCalledWith({
      eventPayload: result,
      metadata: expect.objectContaining(injectedResultLinkMetadataPerEvent.UserClickedAResult)
    });
    expect(resultClickListener).toHaveBeenCalledWith({
      eventPayload: result,
      metadata: expect.not.objectContaining(
        injectedResultLinkMetadataPerEvent.UserClickedResultAddToCart
      )
    });

    expect(addToCartClickListener).toHaveBeenCalledTimes(1);
    expect(addToCartClickListener).toHaveBeenCalledWith({
      eventPayload: result,
      metadata: expect.objectContaining(
        injectedResultLinkMetadataPerEvent.UserClickedResultAddToCart
      )
    });
    expect(addToCartClickListener).toHaveBeenCalledWith({
      eventPayload: result,
      metadata: expect.not.objectContaining(injectedResultLinkMetadataPerEvent.UserClickedAResult)
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
