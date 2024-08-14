import { mount, VueWrapper } from '@vue/test-utils';
import { NumberRangeFilter } from '@empathyco/x-types';
import { getNumberRangeFilterStub } from '../../../../__stubs__/filters-stubs.factory';
import BasePriceFilterLabel from '../base-price-filter-label.vue';

function renderBasePriceLabel({
  filter,
  format,
  lessThan = 'Less than {max}',
  from = 'More than {min}',
  fromTo = 'From {min} to {max}'
}: RenderBasePriceLabelOptions): VueWrapper {
  return mount(
    {
      components: { BasePriceFilterLabel },
      props: ['filter', 'lessThan', 'from', 'fromTo', 'format'],
      template: `<BasePriceFilterLabel :filter="filter" :format="format"
        :less-than="lessThan" :from="from" :from-to="fromTo" />`
    },
    {
      propsData: {
        filter,
        format,
        lessThan,
        from,
        fromTo
      }
    }
  );
}

describe('testing BasePriceLabel component', () => {
  it('renders component with filter without min value', () => {
    const filter = getNumberRangeFilterStub({ range: { min: null, max: 10 } });
    const wrapper = renderBasePriceLabel({
      filter,
      format: '$i,iii'
    });
    expect(wrapper.text()).toEqual('Less than $10');
  });

  it('renders component with filter with min and max value', () => {
    const filter = getNumberRangeFilterStub({ range: { min: 0, max: 10 } });
    const wrapper = renderBasePriceLabel({
      filter,
      format: 'i,dd €'
    });
    expect(wrapper.text()).toEqual('From 0,00 € to 10,00 €');
  });

  it('renders component with filter without max value', () => {
    const filter = getNumberRangeFilterStub({ range: { min: 1000, max: null } });
    const wrapper = renderBasePriceLabel({
      filter,
      format: 'i.iii €'
    });
    expect(wrapper.text()).toEqual('More than 1.000 €');
  });
});

/**
 * Options to configure how the base price component should be rendered.
 */
interface RenderBasePriceLabelOptions {
  filter: NumberRangeFilter;
  format?: string;
  lessThan?: string;
  fromTo?: string;
  from?: string;
  template?: string;
}
