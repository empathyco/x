import { mount } from '@vue/test-utils';
import { getResultsStub } from '../../__stubs__/results-stubs.factory';
import { getDataTestSelector, installNewXPlugin } from '../../__tests__/utils';
import BaseResultAddToCart from '../base-result-add-to-cart.vue';

describe('testing BaseResultAddToCart component', () => {
  const result = getResultsStub()[0];
  const [, localVue] = installNewXPlugin();

  it('emits UserClickedResultAddToCart when the user click on the component', () => {
    const resultAddToCartWrapper = mount(BaseResultAddToCart, {
      localVue,
      propsData: { result }
    });
    const listener = jest.fn();
    resultAddToCartWrapper.vm.$x.on('UserClickedResultAddToCart').subscribe(listener);
    resultAddToCartWrapper.trigger('click');
    expect(listener).toHaveBeenCalledWith(result);
  });

  it('renders the content overriding default slot', () => {
    const wrapperComponent = {
      template: `
        <BaseResultAddToCart :result="result">
          <img data-test="result-add-to-cart-icon" src="./add-to-cart.svg" />
          <span data-test="result-add-to-cart-text">Add to cart</span>
        </BaseResultAddToCart>
      `,
      props: ['result'],
      components: {
        BaseResultAddToCart
      }
    };

    const customResultAddToCartWrapper = mount(wrapperComponent, {
      localVue,
      propsData: { result }
    });
    expect(
      customResultAddToCartWrapper.find(getDataTestSelector('result-add-to-cart')).element
    ).toBeDefined();
    expect(
      customResultAddToCartWrapper.find(getDataTestSelector('result-add-to-cart-icon')).element
    ).toBeDefined();
    expect(customResultAddToCartWrapper.text()).toEqual('Add to cart');
  });
});
