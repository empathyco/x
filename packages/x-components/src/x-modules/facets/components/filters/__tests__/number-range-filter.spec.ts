import { NumberRangeFilter as NumberRangeFilterModel } from '@empathyco/x-types';
import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { getNumberRangeFilterStub } from '../../../../../__stubs__/filters-stubs.factory';
import { getDataTestSelector } from '../../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../../../../../components';
import NumberRangeFilter from '../number-range-filter.vue';

function renderNumberRangeFilter({
  template = '<NumberRangeFilter :filter="filter"/>',
  filter = getNumberRangeFilterStub()
}: NumberRangeFilterWrapperData = {}): NumberRangeFilterAPI {
  Vue.observable(filter);
  const emit = jest.fn();
  const wrapper = mount(
    {
      components: { NumberRangeFilter },
      props: ['filter'],
      template
    },
    {
      propsData: {
        filter
      },
      mocks: {
        $x: {
          emit
        }
      }
    }
  );

  const filterWrapper = wrapper.findComponent(NumberRangeFilter);

  return {
    wrapper,
    filterWrapper,
    emit,
    filter,
    clickFilter() {
      wrapper.trigger('click');
    },
    selectFilter() {
      filter.selected = true;
      return Vue.nextTick();
    }
  };
}

describe('testing NumberRangeFilter component', () => {
  it('is an x-component', () => {
    const { filterWrapper } = renderNumberRangeFilter();

    expect(isXComponent(filterWrapper.vm)).toEqual(true);
  });

  it('belongs to the `facets` x-module', () => {
    const { filterWrapper } = renderNumberRangeFilter();

    expect(getXComponentXModuleName(filterWrapper.vm)).toEqual('facets');
  });

  it('renders the provided filter by default', () => {
    const { wrapper, filter } = renderNumberRangeFilter();

    expect(wrapper.text()).toEqual(filter.label);
  });

  it('emits `UserClickedAFilter` & `UserClickedANumberRangeFilter` events when clicked', () => {
    const { wrapper, clickFilter, emit, filter } = renderNumberRangeFilter();

    clickFilter();

    expect(emit).toHaveBeenCalledTimes(2);
    ['UserClickedAFilter', 'UserClickedANumberRangeFilter'].forEach(event => {
      expect(emit).toHaveBeenCalledWith(event, filter, { target: wrapper.element });
    });
  });

  it('allows customizing the rendered content with an slot', () => {
    const { wrapper, filter } = renderNumberRangeFilter({
      template: `
      <NumberRangeFilter :filter="filter" v-slot="{ filter }">
        <span data-test="custom-label">{{ filter.label }}</span>
      </NumberRangeFilter>
      `
    });

    const customLabel = wrapper.find(getDataTestSelector('custom-label'));
    expect(customLabel.text()).toEqual(filter.label);
  });

  it('adds selected classes to the rendered element when the filter is selected', async () => {
    const { wrapper, selectFilter } = renderNumberRangeFilter();

    expect(wrapper.classes()).not.toContain('x-filter--is-selected');
    expect(wrapper.classes()).not.toContain('x-number-range-filter--is-selected');

    await selectFilter();

    expect(wrapper.classes()).toContain('x-filter--is-selected');
    expect(wrapper.classes()).toContain('x-number-range-filter--is-selected');
  });
});

interface NumberRangeFilterWrapperData {
  template?: string;
  filter?: NumberRangeFilterModel;
}

interface NumberRangeFilterAPI {
  wrapper: Wrapper<Vue>;
  filterWrapper: Wrapper<Vue>;
  emit: jest.Mock;
  filter: NumberRangeFilterModel;
  clickFilter: () => void;
  selectFilter: () => Promise<void>;
}
