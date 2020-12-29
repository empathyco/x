import { mount, Wrapper } from '@vue/test-utils';
import { NumberRangeFilter } from '@empathy/search-types';
import { getNumberRangeFilterStub } from '../../../__stubs__/filters-stubs.factory';
import BasePriceFilterTitle from '../base-price-filter-title.vue';

function renderBasePriceTitle({
  filter,
  hideIntegerDecimals,
  format,
  lessThan = 'Less than {max}',
  from = 'More than {min}',
  fromTo = 'From {min} to {max}'
}: RenderBasePriceTitleOptions): Wrapper<BasePriceFilterTitle> {
  return mount(BasePriceFilterTitle, {
    propsData: {
      filter,
      hideIntegerDecimals,
      format,
      lessThan,
      from,
      fromTo
    }
  });
}

describe('testing BasePriceTitle component', () => {
  it('renders component with filter without min value', () => {
    const filter = getNumberRangeFilterStub({ value: { min: null, max: 10 } });
    const wrapper = renderBasePriceTitle({
      filter,
      format: '$i.dd',
      hideIntegerDecimals: true
    });
    expect(wrapper.text()).toEqual('Less than $10');
  });

  it('renders component with filter with min and max value', () => {
    const filter = getNumberRangeFilterStub({ value: { min: 0, max: 10 } });
    const wrapper = renderBasePriceTitle({
      filter,
      format: 'i,dd €',
      hideIntegerDecimals: false
    });
    expect(wrapper.text()).toEqual('From 0,00 € to 10,00 €');
  });

  it('renders component with filter without max value', () => {
    const filter = getNumberRangeFilterStub({ value: { min: 1000, max: null } });
    const wrapper = renderBasePriceTitle({
      filter,
      format: 'i.iii €'
    });
    expect(wrapper.text()).toEqual('More than 1.000 €');
  });
});

/**
 * Options to configure how the base price component should be rendered.
 */
interface RenderBasePriceTitleOptions {
  filter: NumberRangeFilter;
  format?: string;
  hideIntegerDecimals?: boolean;
  lessThan?: string;
  fromTo?: string;
  from?: string;
}
