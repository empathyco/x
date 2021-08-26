import { BooleanFilter } from '@empathyco/x-types';
import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { getXComponentXModuleName, isXComponent } from '../../../../../components';
import { XEventsTypes } from '../../../../../wiring/events.types';
import {
  createSimpleFilter,
  createSimpleFilter,
  getSimpleFilterStub
} from '../../../../../__stubs__/filters-stubs.factory';
import { getDataTestSelector } from '../../../../../__tests__/utils';
import BaseFilter from '../base-filter.vue';

function renderBaseFilter({
  template = '<BaseFilter :filter="filter" :clickEvents="clickEvents"/>',
  filter = createSimpleFilter('category', 'men'),
  clickEvents
}: RenderBaseFilterOptions = {}): RenderBaseFilterAPI {
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

  const baseFilterWrapper = wrapper.findComponent(BaseFilter);

  return {
    wrapper: baseFilterWrapper,
    emit,
    filter,
    clickFilter() {
      baseFilterWrapper.trigger('click');
    },
    selectFilter() {
      filter.selected = true;
      return Vue.nextTick();
    }
  };
}

describe('testing Filter component', () => {
  it('is an x-component', () => {
    const { wrapper } = renderBaseFilter();

    expect(isXComponent(wrapper.vm)).toEqual(true);
  });

  it('belongs to the `facets` x-module', () => {
    const { wrapper } = renderBaseFilter();

    expect(getXComponentXModuleName(wrapper.vm)).toEqual('facets');
  });

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

  it('disables the filter when it has no results', async () => {
    const filter = createSimpleFilter('category', 'men', false);
    const { wrapper } = renderBaseFilter({ filter });

    expect(wrapper.classes()).not.toContain('x-filter--is-disabled');
    expect(wrapper.attributes('disabled')).toBeUndefined();

    filter.totalResults = 0;
    await wrapper.vm.$nextTick();

    expect(wrapper.classes()).toContain('x-filter--is-disabled');
    expect(wrapper.attributes('disabled')).toBe('disabled');
  });
});

interface RenderBaseFilterOptions {
  /** The template containing the {@link BaseFilter} component to render. */
  template?: string;
  /** The filter data. Passed as prop to the {@link BaseFilter} component. */
  filter?: BooleanFilter;
  /** Additional events to emit when the filter is clicked.
   * Passed as prop to the {@link BaseFilter} component. */
  clickEvents?: Partial<XEventsTypes>;
}

interface RenderBaseFilterAPI {
  /** Wrapper of the {@link BaseFilter} component. */
  wrapper: Wrapper<Vue>;
  /** Mock of the {@link XBus.emit} function. */
  emit: jest.Mock;
  /** The rendered filter data. */
  filter: BooleanFilter;
  /** Fakes a click on the filter component. */
  clickFilter: () => void;
  /** Sets the {@link RenderBaseFilterAPI.filter} `selected` property to `true`. */
  selectFilter: () => Promise<void>;
}
