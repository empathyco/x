import { NumberRangeFilter } from '@empathy/search-types';
import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { getNumberRangeFilterStub } from '../../../__stubs__/filters-stubs.factory';
import { getDataTestSelector } from '../../../__tests__/utils';
import BaseNumberRangeFilter from '../../filters/base-number-range-filter.vue';

function renderBaseNumberRangeFilter({
  template = '<BaseNumberRangeFilter :filter="filter"/>',
  filter = getNumberRangeFilterStub()
}: BaseNumberRangeFilterWrapperData = {}): BaseNumberRangeFilterAPI {
  Vue.observable(filter);
  const emit = jest.fn();
  const wrapper = mount(
    {
      components: { BaseNumberRangeFilter },
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

  return {
    wrapper,
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

describe('testing BaseNumberRangeFilter component', () => {
  it('renders the provided filter by default', () => {
    const { wrapper, filter } = renderBaseNumberRangeFilter();

    expect(wrapper.text()).toEqual(filter.label);
  });

  it('emits `UserClickedAFilter` & `UserClickedANumberRangeFilter` events when clicked', () => {
    const { wrapper, clickFilter, emit, filter } = renderBaseNumberRangeFilter();

    clickFilter();

    expect(emit).toHaveBeenCalledTimes(2);
    ['UserClickedAFilter', 'UserClickedANumberRangeFilter'].forEach(event => {
      expect(emit).toHaveBeenCalledWith(event, filter, { target: wrapper.element });
    });
  });

  it('allows customizing the rendered content with an slot', () => {
    const { wrapper, filter } = renderBaseNumberRangeFilter({
      template: `
      <BaseNumberRangeFilter :filter="filter" v-slot="{ filter }">
        <span data-test="custom-label">{{ filter.label }}</span>
      </BaseNumberRangeFilter>
      `
    });

    const customLabel = wrapper.find(getDataTestSelector('custom-label'));
    expect(customLabel.text()).toEqual(filter.label);
  });

  it('adds selected classes to the rendered element when the filter is selected', async () => {
    const { wrapper, selectFilter } = renderBaseNumberRangeFilter();

    expect(wrapper.classes()).not.toContain('x-filter--is-selected');
    expect(wrapper.classes()).not.toContain('x-number-range-filter--is-selected');

    await selectFilter();

    expect(wrapper.classes()).toContain('x-filter--is-selected');
    expect(wrapper.classes()).toContain('x-number-range-filter--is-selected');
  });
});

interface BaseNumberRangeFilterWrapperData {
  template?: string;
  filter?: NumberRangeFilter;
}

interface BaseNumberRangeFilterAPI {
  wrapper: Wrapper<Vue>;
  emit: jest.Mock<any, any>;
  filter: NumberRangeFilter;
  clickFilter: () => void;
  selectFilter: () => Promise<void>;
}
