import { Result } from '@empathyco/x-types';
import { mount, Wrapper } from '@vue/test-utils';
import Vue, { ComponentOptions } from 'vue';
import { getDataTestSelector } from '../../../__tests__/utils';
import BaseCurrency from '../../currency/base-currency.vue';
import BaseResultPreviousPrice from '../base-result-previous-price.vue';

const mockedResult: Pick<Result, 'price'> = {
  price: {
    hasDiscount: true,
    originalValue: 29.99,
    value: 19.99
  }
};

function renderBasePreviousPrice({
  format = 'i,iii.dd',
  template = `
    <BaseResultPreviousPrice :result="result"
      :format="format" />`,
  result = mockedResult
}: RenderBasePreviousPriceOptions = {}): RenderBasePreviousPriceAPI {
  const wrapperComponent: ComponentOptions<Vue> = {
    template,
    components: {
      BaseResultPreviousPrice
    },
    props: ['format', 'result']
  };

  const wrapper = mount(wrapperComponent, {
    propsData: {
      format,
      result
    }
  });

  return {
    wrapper
  };
}

describe('testing BaseResultPreviousPrice component', () => {
  it('renders a BaseCurrency component', () => {
    const { wrapper } = renderBasePreviousPrice();
    expect(wrapper.findComponent(BaseCurrency)).toBeDefined();
  });

  it('renders the previous price with a custom format', () => {
    const { wrapper } = renderBasePreviousPrice({
      format: 'i.iii,ddd €'
    });

    expect(wrapper.text()).toBe('29,990 €');
  });

  it('renders the previous price hiding integer decimals', () => {
    const { wrapper } = renderBasePreviousPrice({
      format: 'i.iii'
    });

    expect(wrapper.text()).toBe('29');
  });

  it('should not render the previous price if it has no discount', () => {
    const { wrapper } = renderBasePreviousPrice({
      result: {
        price: {
          hasDiscount: false,
          originalValue: 29.99,
          value: 29.99
        }
      }
    });

    expect(wrapper.html()).toBe('');
  });

  it('renders custom content when overriding the default slot', () => {
    const { wrapper } = renderBasePreviousPrice({
      template: `
        <BaseResultPreviousPrice :result="result">
          <span data-test="override-default-slot">{{ result.price.originalValue }}</span>
        </BaseResultPreviousPrice>`
    });

    expect(wrapper.find(getDataTestSelector('override-default-slot')).exists()).toBe(true);
    expect(wrapper.text()).toBe(mockedResult.price!.originalValue.toString());
  });
});

interface RenderBasePreviousPriceOptions {
  /** The format to apply to the value. */
  format?: string;
  /** The result with the price to display. */
  result?: Pick<Result, 'price'>;
  /**
   * The template to render. Receives the 'result', 'format' prop and has registered a
   * {@link BaseCurrency | BaseCurrency component}.
   */
  template?: string;
}

interface RenderBasePreviousPriceAPI {
  /** The Vue testing utils wrapper for the {@link BaseResultPreviousPrice}. */
  wrapper: Wrapper<Vue>;
}
