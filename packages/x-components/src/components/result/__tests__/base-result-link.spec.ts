import type { Result } from '@empathyco/x-types'
import type { VueWrapper } from '@vue/test-utils'
import type { FeatureLocation } from '../../../types/origin'
import type { PropsWithType } from '../../../utils/index'
import type { XEvent, XEventsTypes } from '../../../wiring/events.types'
import type { WireMetadata } from '../../../wiring/index'
import { mount } from '@vue/test-utils'
import { createResultStub } from '../../../__stubs__/results-stubs.factory'
import { getDataTestSelector, installNewXPlugin } from '../../../__tests__/utils'
import { XPlugin } from '../../../plugins/index'
import BaseResultLink from '../base-result-link.vue'

describe('testing BaseResultLink component', () => {
  const result = createResultStub('Product 001', {
    images: ['https://picsum.photos/seed/1/200/300', 'https://picsum.photos/seed/2/200/300'],
  })
  let resultLinkWrapper: VueWrapper
  const template = '<BaseResultLink :result="result"/>'
  beforeEach(() => {
    resultLinkWrapper = mount(
      {
        components: { BaseResultLink },
        props: ['result'],
        template,
      },
      {
        global: { plugins: [installNewXPlugin()] },
        props: { result },
      },
    )
  })

  it('emits UserClickedAResult when the user clicks in the left, middle or right button on the component', async () => {
    const listener = jest.fn()
    XPlugin.bus.on('UserClickedAResult').subscribe(listener)

    await resultLinkWrapper.trigger('click')
    expect(listener).toHaveBeenNthCalledWith(1, result)

    await resultLinkWrapper.trigger('click', { button: 1 })
    expect(listener).toHaveBeenNthCalledWith(2, result)

    await resultLinkWrapper.trigger('click', { button: 2 })
    expect(listener).toHaveBeenNthCalledWith(3, result)

    expect(listener).toHaveBeenCalledTimes(3)
  })

  it('emits events provided from parent element with provided location in metadata', async () => {
    const resultLinkWrapper = mount(
      {
        components: { BaseResultLink },
        props: ['result'],
        template,
      },
      {
        provide: {
          resultClickExtraEvents: <XEvent[]>['UserClickedResultAddToCart'],
          location: <FeatureLocation>'no_query',
        },
        props: { result },
      },
    )

    const listener = jest.fn()
    XPlugin.bus.on('UserClickedResultAddToCart', true).subscribe(listener)

    await resultLinkWrapper.trigger('click')

    expect(listener).toHaveBeenCalledWith({
      eventPayload: result,
      metadata: expect.objectContaining({
        location: 'no_query',
      }),
    })
  })

  it('emits events with the extra metadata provided from parent element', async () => {
    const injectedResultLinkMetadataPerEvent: Partial<
      Record<
        PropsWithType<XEventsTypes, Result>,
        Omit<WireMetadata, 'moduleName' | 'origin' | 'location'>
      >
    > = {
      UserClickedAResult: {
        ignoreInModules: ['tagging'],
      },
      UserClickedResultAddToCart: {
        replaceable: false,
      },
    }

    const resultLinkWrapper = mount(
      {
        components: { BaseResultLink },
        props: ['result'],
        template,
      },
      {
        provide: {
          resultClickExtraEvents: <XEvent[]>['UserClickedResultAddToCart'],
          resultLinkMetadataPerEvent: injectedResultLinkMetadataPerEvent,
        },

        props: { result },
      },
    )

    const resultClickListener = jest.fn()
    XPlugin.bus.on('UserClickedAResult', true).subscribe(resultClickListener)

    const addToCartClickListener = jest.fn()
    XPlugin.bus.on('UserClickedResultAddToCart', true).subscribe(addToCartClickListener)

    await resultLinkWrapper.trigger('click')

    expect(resultClickListener).toHaveBeenCalledTimes(1)
    expect(resultClickListener).toHaveBeenCalledWith({
      eventPayload: result,
      metadata: expect.objectContaining(injectedResultLinkMetadataPerEvent.UserClickedAResult),
    })
    expect(resultClickListener).toHaveBeenCalledWith({
      eventPayload: result,
      metadata: expect.not.objectContaining(
        injectedResultLinkMetadataPerEvent.UserClickedResultAddToCart,
      ),
    })

    expect(addToCartClickListener).toHaveBeenCalledTimes(1)
    expect(addToCartClickListener).toHaveBeenCalledWith({
      eventPayload: result,
      metadata: expect.objectContaining(
        injectedResultLinkMetadataPerEvent.UserClickedResultAddToCart,
      ),
    })
    expect(addToCartClickListener).toHaveBeenCalledWith({
      eventPayload: result,
      metadata: expect.not.objectContaining(injectedResultLinkMetadataPerEvent.UserClickedAResult),
    })
  })

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
        BaseResultLink,
      },
    }

    const customResultLinkWrapper = mount(wrapperComponent, {
      props: { result },
    })
    expect(customResultLinkWrapper.find(getDataTestSelector('result-link')).element).toBeDefined()
    expect(
      customResultLinkWrapper.find(getDataTestSelector('result-link-image')).element,
    ).toBeDefined()
    expect(
      customResultLinkWrapper.find(getDataTestSelector('result-link-image')).attributes('src'),
    ).toEqual(result.images![0])
    expect(customResultLinkWrapper.find(getDataTestSelector('result-link-text')).text()).toEqual(
      result.name,
    )
  })
})
