import { Result } from '@empathyco/x-types';
import { mount, Wrapper } from '@vue/test-utils';
import { getResultsStub } from '../../../__stubs__/results-stubs.factory';
import { getDataTestSelector, installNewXPlugin } from '../../../__tests__/utils';
import { XBus } from '../../../plugins/index';
import { Dictionary } from '../../../utils/index';
import BaseResultAddToCart from '../base-result-add-to-cart.vue';

describe('testing BaseResultAddToCart component', () => {
  const result = getResultsStub()[0];

  function renderAddToCart({
    result = { name: 'TEST' } as Result,
    template = '<BaseResultAddToCart :result="result"/>',
    methods = {}
  }: RenderAddToCartOptions): RenderAddToCartApi {
    const [, localVue] = installNewXPlugin();
    const wrapper = mount(
      { template, data: () => ({ result }), methods },
      {
        components: { BaseResultAddToCart },
        localVue
      }
    );
    return {
      clickAddToCart(): Promise<void> {
        return wrapper
          .find(getDataTestSelector('result-add-to-cart'))
          .trigger('click') as Promise<void>;
      },
      on: wrapper.vm.$x.on,
      addToCartWrapper: wrapper.find(getDataTestSelector('result-add-to-cart'))
    };
  }

  it('emits UserClickedResultAddToCart when the user click on the component', async () => {
    const { clickAddToCart, on } = renderAddToCart({ result });
    const listener = jest.fn();
    on('UserClickedResultAddToCart').subscribe(listener);
    await clickAddToCart();
    expect(listener).toHaveBeenCalledWith(result);
  });

  it('renders the content overriding default slot', () => {
    const { addToCartWrapper } = renderAddToCart({
      template: `
        <BaseResultAddToCart :result="result">
          <img data-test="result-add-to-cart-icon" src="./add-to-cart.svg" />
          <span data-test="result-add-to-cart-text">Add to cart</span>
        </BaseResultAddToCart>
      `,
      result
    });

    expect(addToCartWrapper.element).toBeDefined();
    expect(
      addToCartWrapper.find(getDataTestSelector('result-add-to-cart-icon')).element
    ).toBeDefined();
    expect(addToCartWrapper.text()).toEqual('Add to cart');
  });

  it('uses the listeners passed', async () => {
    const listener = jest.fn();
    const { clickAddToCart } = renderAddToCart({
      template: '<BaseResultAddToCart @click="miClick" :result="result"/>',
      result,
      methods: {
        miClick: listener
      }
    });
    await clickAddToCart();

    expect(listener).toHaveBeenCalled();
  });
});

interface RenderAddToCartOptions {
  result: Result;
  template?: string;
  methods?: Dictionary<() => void>;
}
interface RenderAddToCartApi {
  clickAddToCart: () => Promise<void>;
  on: XBus['on'];
  addToCartWrapper: Wrapper<Vue>;
}
