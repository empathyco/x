import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { createResultStub } from '../../../__stubs__/results-stubs.factory'
import { getDataTestSelector, installNewXPlugin } from '../../../__tests__/utils'
import { XPlugin } from '../../../plugins'
import BaseResultAddToCart from '../base-result-add-to-cart.vue'

function render({
  result = createResultStub('Result Test'),
  template = '<BaseResultAddToCart :result="result"/>',
  methods = {},
  events = undefined,
}: {
  result?: any
  template?: string
  methods?: Record<string, unknown>
  events?: any
} = {}) {
  const wrapper = mount(
    { template, data: () => ({ result, events }), methods },
    {
      components: { BaseResultAddToCart },
      global: { plugins: [installNewXPlugin()] },
      props: { result, events },
    },
  )
  return {
    clickAddToCart: async () =>
      wrapper.find(getDataTestSelector('result-add-to-cart')).trigger('click'),
    addToCartWrapper: wrapper.find(getDataTestSelector('result-add-to-cart')),
  }
}

describe('testing BaseResultAddToCart component', () => {
  it('emits UserClickedResultAddToCart when the user click on the component', async () => {
    const testResult = createResultStub('My Result')
    const { clickAddToCart } = render({
      result: testResult,
    })
    const listener = vi.fn()
    XPlugin.bus.on('UserClickedResultAddToCart').subscribe(listener)
    await clickAddToCart()

    expect(listener).toHaveBeenCalledWith(testResult)
  })

  it('emits UserClickedVendorResultAddToCart for VendorResult', async () => {
    const vendorResult = {
      id: 'vendor-1',
      modelName: 'VendorResult' as const,
      position: 1,
      name: 'Vendor Result',
      type: 'product',
      url: 'https://example.com',
    } as any
    const { clickAddToCart } = render({
      result: vendorResult,
      events: { UserClickedVendorResultAddToCart: vendorResult },
    })
    const listener = vi.fn()
    XPlugin.bus.on('UserClickedVendorResultAddToCart').subscribe(listener)
    await clickAddToCart()

    expect(listener).toHaveBeenCalledWith(vendorResult)
  })

  it('renders the content overriding default slot', () => {
    const { addToCartWrapper } = render({
      template: `
        <BaseResultAddToCart :result="result">
          <img data-test="result-add-to-cart-icon" src="./add-to-cart.svg" />
          <span data-test="result-add-to-cart-text">Add to cart</span>
        </BaseResultAddToCart>
      `,
    })

    expect(addToCartWrapper.element).toBeDefined()
    expect(
      addToCartWrapper.find(getDataTestSelector('result-add-to-cart-icon')).element,
    ).toBeDefined()
    expect(addToCartWrapper.text()).toEqual('Add to cart')
  })

  it('emits multiple events', async () => {
    const testResult = createResultStub('My Result')
    const customEvents = {
      UserClickedResultAddToCart: testResult,
      UserClickedAResult: testResult,
    }

    const { clickAddToCart } = render({
      result: testResult,
      events: customEvents,
    })

    const resultListener = vi.fn()
    const addToCartListener = vi.fn()
    XPlugin.bus.on('UserClickedAResult').subscribe(resultListener)
    XPlugin.bus.on('UserClickedResultAddToCart').subscribe(addToCartListener)

    await clickAddToCart()

    expect(resultListener).toHaveBeenCalledWith(testResult)
    expect(addToCartListener).toHaveBeenCalledWith(testResult)
  })
})
