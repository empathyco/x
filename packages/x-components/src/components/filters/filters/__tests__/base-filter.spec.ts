import { Filter } from '@empathy/search-types';
import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { XEventsTypes } from '../../../../wiring/events.types';
import { getSimpleFilterStub } from '../../../../__stubs__/filters-stubs.factory';
import { getDataTestSelector } from '../../../../__tests__/utils';
import BaseFilter from '../base-filter.vue';

function renderBaseFilter({
  template = '<BaseFilter :filter="filter" :clickEvents="clickEvents"/>',
  filter = getSimpleFilterStub(),
  clickEvents
}: RenderBaseFilterOptions = {}): BaseFilterAPI {
  Vue.observable(filter);
  const emit = jest.fn();
  const wrapper = mount(
    {
      components: { BaseFilter },
      props: ['filter', 'clickEvents'],
      template
    },
    {
      propsData: {
        filter,
        clickEvents
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

describe('testing BaseFilter component', () => {
  it('renders the provided filter by default', () => {
    const { wrapper, filter } = renderBaseFilter();

    expect(wrapper.text()).toEqual(filter.label);
  });

  it('emits UserClickedAFilter when clicked', () => {
    const { wrapper, clickFilter, emit, filter } = renderBaseFilter();

    clickFilter();

    expect(emit).toHaveBeenCalledTimes(1);
    expect(emit).toHaveBeenCalledWith('UserClickedAFilter', filter, {
      target: wrapper.element
    });
  });

  it('emits UserClickedAFilter and other custom events when clicked', () => {
    const filter = getSimpleFilterStub();
    const { wrapper, clickFilter, emit } = renderBaseFilter({
      filter,
      clickEvents: {
        UserClickedASimpleFilter: filter
      }
    });

    clickFilter();

    expect(emit).toHaveBeenCalledTimes(2);
    expect(emit).toHaveBeenCalledWith('UserClickedAFilter', filter, {
      target: wrapper.element
    });
    expect(emit).toHaveBeenCalledWith('UserClickedASimpleFilter', filter, {
      target: wrapper.element
    });
  });

  it('allows customizing the rendered content with an slot', () => {
    const { wrapper, filter } = renderBaseFilter({
      template: `
      <BaseFilter :filter="filter" v-slot="{ filter }">
        <span data-test="custom-label">{{ filter.label }}</span>
      </BaseFilter>
      `
    });

    const customLabel = wrapper.find(getDataTestSelector('custom-label'));
    expect(customLabel.text()).toEqual(filter.label);
  });

  it('adds selected classes to the rendered element when the filter is selected', async () => {
    const { wrapper, selectFilter } = renderBaseFilter();

    expect(wrapper.classes()).not.toContain('x-filter--is-selected');

    await selectFilter();

    expect(wrapper.classes()).toContain('x-filter--is-selected');
  });
});

interface RenderBaseFilterOptions {
  template?: string;
  filter?: Filter;
  clickEvents?: Partial<XEventsTypes>;
}

interface BaseFilterAPI {
  wrapper: Wrapper<Vue>;
  emit: jest.Mock<any, any>;
  filter: Filter;
  clickFilter: () => void;
  selectFilter: () => Promise<void>;
}
