import { Result } from '@empathyco/x-types';
import { mount, Wrapper } from '@vue/test-utils';
import Vue, { ComponentOptions } from 'vue';
import { getDataTestSelector } from '../../../__tests__/utils';
import BaseCurrency from '../../currency/base-currency.vue';
import BaseResultCurrentPrice from '../base-result-current-price.vue';

const mockedResult: Pick<Result, 'price'> = {
  price: {
    hasDiscount: true,
    originalValue: 29.99,
    value: 19.99
  }
};

function renderBaseCurrentPrice({
  format = 'i,iii.dd',
  hideIntegerDecimals = false,
  // eslint-disable-next-line max-len
  template = `<BaseResultCurrentPrice :result="result" :format="format" :hideIntegerDecimals="hideIntegerDecimals" />`,
  result = mockedResult
}: RenderBaseCurrentPriceOptions = {}): RenderBaseCurrentPriceAPI {
  const wrapperComponent: ComponentOptions<Vue> = {
    template,
    components: {
      BaseResultCurrentPrice
    },
    props: ['format', 'hideIntegerDecimals', 'result']
  };

  const wrapper = mount(wrapperComponent, {
    propsData: {
      format,
      hideIntegerDecimals,
      result
    }
  });

  return {
    wrapper
  };
}

describe('testing BaseCurrentPrice component', () => {
  it('renders a BaseCurrency component', () => {
    const { wrapper } = renderBaseCurrentPrice();
    expect(wrapper.findComponent(BaseCurrency)).toBeDefined();
  });

  it('renders the current price with a custom format', () => {
    const { wrapper } = renderBaseCurrentPrice({
      format: 'i.iii,ddd €'
    });

    expect(wrapper.text()).toBe('19,990 €');
  });

  it('renders the current price hiding integer decimals', () => {
    const { wrapper } = renderBaseCurrentPrice({
      hideIntegerDecimals: true
    });

    expect(wrapper.text()).toBe('19');
  });

  it('adds "x-result-current-price--on-sale" css class because the price is discounted', () => {
    const { wrapper } = renderBaseCurrentPrice();

    expect(wrapper.classes()).toContain('x-result-current-price--on-sale');
  });

  // eslint-disable-next-line max-len
  it('does not add "x-result-current-price--on-sale" css class because the price is not discounted', () => {
    const { wrapper } = renderBaseCurrentPrice({
      result: {
        price: {
          hasDiscount: false,
          originalValue: 29.99,
          value: 29.99
        }
      }
    });

    expect(wrapper.classes()).not.toContain('x-result-current-price--on-sale');
  });

  it('renders custom content when overriding the default slot', () => {
    const { wrapper } = renderBaseCurrentPrice({
      template: `
        <BaseResultCurrentPrice :result="result">
          <span data-test="override-default-slot">{{ result.price.value }}</span>
        </BaseResultCurrentPrice>`
    });

    expect(wrapper.find(getDataTestSelector('override-default-slot')).exists()).toBe(true);
    expect(wrapper.text()).toBe(mockedResult.price.value.toString());
  });
});

interface RenderBaseCurrentPriceOptions {
  /** The format to apply to the value. */
  format?: string;
  /** Hide or show decimals. */
  hideIntegerDecimals?: boolean;
  /** The result with the price to display. */
  result?: Pick<Result, 'price'>;
  /** The template to render. Receives the 'result', 'format' and 'hideIntegerDecimals' props and
   * has registered a {@link BaseCurrency | BaseCurrency component}. */
  template?: string;
}

interface RenderBaseCurrentPriceAPI {
  /** The Vue testing utils wrapper for the {@link BaseResultCurrentPrice}. */
  wrapper: Wrapper<Vue>;
}
