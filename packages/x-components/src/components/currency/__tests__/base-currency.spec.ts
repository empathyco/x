import { mount, Wrapper } from '@vue/test-utils';
import BaseCurrency from '../base-currency.vue';

function renderBaseCurrency({
  value,
  format,
  hideIntegerDecimals
}: RenderBaseCurrencyOptions): Wrapper<BaseCurrency> {
  return mount(BaseCurrency, {
    propsData: {
      value,
      format,
      hideIntegerDecimals
    }
  });
}

describe('testing BaseCurrency component', () => {
  it('renders the provided format correctly with hideIntegerDecimals set as true', () => {
    const wrapper = renderBaseCurrency({
      value: 12345678,
      format: 'i.iii,ddd €',
      hideIntegerDecimals: true
    });
    expect(wrapper.text()).toEqual('12.345.678 €');
  });

  it('renders the provided currency at the start of the format', () => {
    const wrapper = renderBaseCurrency({
      value: 12345678.87654321,
      format: '$ i.iii,dd',
      hideIntegerDecimals: false
    });
    expect(wrapper.text()).toEqual('$ 12.345.678,87');
  });

  it('renders the provided currency at the start of the format without space', () => {
    const wrapper = renderBaseCurrency({
      value: 12345678.87654321,
      format: '$i.iii,dd',
      hideIntegerDecimals: false
    });
    expect(wrapper.text()).toEqual('$12.345.678,87');
  });

  it('renders the provided currency at the end of the format', () => {
    const wrapper = renderBaseCurrency({
      value: 12345678.87654321,
      format: 'i.iii,dd €',
      hideIntegerDecimals: false
    });
    expect(wrapper.text()).toEqual('12.345.678,87 €');
  });

  it('renders the provided currency at the end of the format without space', () => {
    const wrapper = renderBaseCurrency({
      value: 12345678.87654321,
      format: 'i.iii,dd€',
      hideIntegerDecimals: false
    });
    expect(wrapper.text()).toEqual('12.345.678,87€');
  });

  it('renders the provided format with comma for thousands and dot for decimals', () => {
    const wrapper = renderBaseCurrency({
      value: 12345678.87654321,
      format: 'i,iii.dd €',
      hideIntegerDecimals: false
    });
    expect(wrapper.text()).toEqual('12,345,678.87 €');
  });

  it('renders the provided format with spaces for thousands separators', () => {
    const wrapper = renderBaseCurrency({
      value: 12345678.87654321,
      format: 'i iii.dd €',
      hideIntegerDecimals: false
    });
    expect(wrapper.text()).toEqual('12 345 678.87 €');
  });

  it(
    'renders the provided format with spaces for thousands separators and custom string (more' +
      ' than one character for decimals',
    () => {
      const wrapper = renderBaseCurrency({
        value: 12345678.87654321,
        format: 'i iii - dd €',
        hideIntegerDecimals: false
      });
      expect(wrapper.text()).toEqual('12 345 678 - 87 €');
    }
  );

  it('renders the provided format correctly with a larger number of decimals', () => {
    const wrapper = renderBaseCurrency({
      value: 12345678.87654321,
      format: 'i.iii,dddddd €',
      hideIntegerDecimals: false
    });
    expect(wrapper.text()).toEqual('12.345.678,876543 €');
  });

  it('renders the provided format correctly filling decimals with non-significant zeros', () => {
    const wrapper = renderBaseCurrency({
      value: 12345678.87,
      format: 'i.iii,dddddd €',
      hideIntegerDecimals: false
    });
    expect(wrapper.text()).toEqual('12.345.678,870000 €');
  });

  it(
    'renders the provided format correctly filling decimals with non-significant zeros and' +
      ' hideIntegerDecimals as false',
    () => {
      const wrapper = renderBaseCurrency({
        value: 12345678,
        format: 'i.iii,dddddd €',
        hideIntegerDecimals: false
      });
      expect(wrapper.text()).toEqual('12.345.678,000000 €');
    }
  );

  it('renders the provided format correctly which only contains integer part', () => {
    const wrapper = renderBaseCurrency({
      value: 12345678.87654321,
      format: 'i.iii €',
      hideIntegerDecimals: false
    });
    expect(wrapper.text()).toEqual('12.345.678 €');
  });
});

interface RenderBaseCurrencyOptions {
  value: number;
  format: string;
  hideIntegerDecimals: boolean;
}
