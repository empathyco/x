import { mount } from '@vue/test-utils'
import { createResultStub } from '../../../__stubs__/results-stubs.factory'
import { getDataTestSelector, installNewXPlugin } from '../../../__tests__/utils'
import { XPlugin } from '../../../plugins'
import BaseResultAddToCart from '../base-result-add-to-cart.vue'

function render({
  result = createResultStub('Result Test'),
  template = '<BaseResultAddToCart :result="result"/>',
  methods = {},
} = {}) {
  const wrapper = mount(
    { template, data: () => ({ result }), methods },
    {
      components: { BaseResultAddToCart },
      global: { plugins: [installNewXPlugin()] },
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
    const { clickAddToCart } = render({ result: testResult })
    const listener = jest.fn()
    XPlugin.bus.on('UserClickedResultAddToCart').subscribe(listener)
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

  it('uses the listeners passed', async () => {
    const listener = jest.fn()
    const { clickAddToCart } = render({
      template: '<BaseResultAddToCart @click="miClick" :result="result"/>',
      methods: {
        miClick: listener,
      },
    })
    await clickAddToCart()

    expect(listener).toHaveBeenCalledTimes(1)
    expect(listener).toHaveBeenCalledWith(expect.any(MouseEvent))
  })
})
