import { Result } from '@empathyco/x-types';
import { Dictionary } from '@empathyco/x-utils';
import { mount, VueWrapper, DOMWrapper } from '@vue/test-utils';
import { XBus } from '@empathyco/x-bus';
import { createResultStub } from '../../../__stubs__/results-stubs.factory';
import { getDataTestSelector, installNewXPlugin } from '../../../__tests__/utils';
import BaseResultAddToCart from '../base-result-add-to-cart.vue';
import { WireMetadata, XEventsTypes } from '../../../wiring/index';
import { XPlugin } from '../../../plugins/index';

describe('testing BaseResultAddToCart component', () => {
  function renderAddToCart({
    result = createResultStub('Result Test'),
    template = '<BaseResultAddToCart :result="result"/>',
    methods = {}
  }: RenderAddToCartOptions): RenderAddToCartApi {
    const wrapper = mount(
      { template, data: () => ({ result }), methods },
      {
        components: { BaseResultAddToCart },
        global: { plugins: [installNewXPlugin()] }
      }
    );
    return {
      clickAddToCart(): Promise<void> {
        return wrapper
          .find(getDataTestSelector('result-add-to-cart'))
          .trigger('click') as Promise<void>;
      },
      addToCartWrapper: wrapper.find(getDataTestSelector('result-add-to-cart'))
    };
  }

  it('emits UserClickedResultAddToCart when the user click on the component', () => {
    const testResult = createResultStub('My Result');
    const { clickAddToCart } = renderAddToCart({ result: testResult });
    const listener = jest.fn();
    XPlugin.bus.on('UserClickedResultAddToCart').subscribe(listener);
    clickAddToCart();
    expect(listener).toHaveBeenCalledWith(testResult);
  });

  it('renders the content overriding default slot', () => {
    const { addToCartWrapper } = renderAddToCart({
      template: `
        <BaseResultAddToCart :result="result">
          <img data-test="result-add-to-cart-icon" src="./add-to-cart.svg" />
          <span data-test="result-add-to-cart-text">Add to cart</span>
        </BaseResultAddToCart>
      `
    });

    expect(addToCartWrapper.element).toBeDefined();
    expect(
      addToCartWrapper.find(getDataTestSelector('result-add-to-cart-icon')).element
    ).toBeDefined();
    expect(addToCartWrapper.text()).toEqual('Add to cart');
  });

  it('uses the listeners passed', () => {
    const listener = jest.fn();
    const { clickAddToCart } = renderAddToCart({
      template: '<BaseResultAddToCart @click="miClick" :result="result"/>',
      methods: {
        miClick: listener
      }
    });
    clickAddToCart();

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(expect.any(MouseEvent));
  });
});

/**
 * The options for the `renderAddToCart` function.
 */
interface RenderAddToCartOptions {
  /** The result to pass to `BaseResultAddToCart` as prop. A stub is used by default.*/
  result?: Result;
  /**
   * The template to render. Remember to use `:result="result"` as prop of the
   * `BaseResultAddToCart`.
   */
  template?: string;
  /** The methods to add to mounted component to test listeners in the `BaseResultAddToCart`. */
  methods?: Dictionary<() => void>;
}
interface RenderAddToCartApi {
  /** Triggers the click on the `BaseResultAddToCart`. */
  clickAddToCart: () => Promise<void>;
  /** The `BaseResultAddToCart` wrapper to use it for testing. */
  addToCartWrapper: DOMWrapper<Element>;
}
