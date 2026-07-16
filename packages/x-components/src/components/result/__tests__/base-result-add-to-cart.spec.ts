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
  provide = {},
}: {
  result?: any
  template?: string
  methods?: Record<string, unknown>
  provide?: Record<string, any>
} = {}) {
  const wrapper = mount(
    { template, data: () => ({ result }), methods },
    {
      components: { BaseResultAddToCart },
      global: { plugins: [installNewXPlugin()], provide },
    },
  )
  return {
    clickAddToCart: async () =>
      wrapper.find(getDataTestSelector('result-add-to-cart')).trigger('click'),
    addToCartWrapper: wrapper.find(getDataTestSelector('result-add-to-cart')),
  }
}

describe('testing BaseResultAddToCart component', () => {
  it('emits default event when the user clicks the component', async () => {
    const testResult = createResultStub('My Result')
    const { clickAddToCart } = render({
      result: testResult,
    })
    const listener = vi.fn()
    XPlugin.bus.on('UserClickedResultAddToCart').subscribe(listener)
    await clickAddToCart()

    expect(listener).toHaveBeenCalledWith(testResult)
  })

  it('emits custom event when clickEvent prop is provided', async () => {
    const testResult = createResultStub('My Result')
    const { clickAddToCart } = render({
      result: testResult,
      template: '<BaseResultAddToCart :result="result" clickEvent="UserClickedAResult"/>',
    })
    const listener = vi.fn()
    XPlugin.bus.on('UserClickedAResult').subscribe(listener)
    await clickAddToCart()

    expect(listener).toHaveBeenCalledWith(testResult)
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

  it('emits multiple events via injection', async () => {
    const testResult = createResultStub('My Result')

    const { clickAddToCart } = render({
      result: testResult,
      provide: {
        resultAddToCartExtraEvents: ['UserClickedAResult'],
      },
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
