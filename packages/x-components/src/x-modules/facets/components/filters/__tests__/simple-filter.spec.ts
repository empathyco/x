import { SimpleFilter as SimpleFilterModel } from '@empathyco/x-types';
import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { createSimpleFilter } from '../../../../../__stubs__/filters-stubs.factory';
import { getDataTestSelector } from '../../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../../../../../components';
import { XEventsTypes } from '../../../../../wiring/events.types';
import SimpleFilter from '../simple-filter.vue';

function renderSimpleFilter({
  template = '<SimpleFilter :filter="filter" :clickEvents="clickEvents" />',
  filter = createSimpleFilter('category', 'women'),
  clickEvents
}: RenderSimpleFilterOptions = {}): RenderSimpleFilterAPI {
  Vue.observable(filter);
  const emit = jest.fn();
  const wrapper = mount(
    {
      components: { SimpleFilter },
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

  const filterWrapper = wrapper.findComponent(SimpleFilter);

  return {
    wrapper: filterWrapper,
    emit,
    filter,
    clickFilter() {
      wrapper.trigger('click');
    },
    selectFilter() {
      filter.selected = true;
      return Vue.nextTick();
    },
    updateFilter(newFields) {
      Object.assign(filter, newFields);
      return Vue.nextTick();
    }
  };
}

describe('testing SimpleFilter component', () => {
  it('is an x-component', () => {
    const { wrapper } = renderSimpleFilter();

    expect(isXComponent(wrapper.vm)).toEqual(true);
  });

  it('belongs to the `facets` x-module', () => {
    const { wrapper } = renderSimpleFilter();

    expect(getXComponentXModuleName(wrapper.vm)).toEqual('facets');
  });

  it('renders the provided filter by default', () => {
    const { wrapper, filter } = renderSimpleFilter();

    expect(wrapper.text()).toEqual(filter.label);
  });

  it('emits `UserClickedAFilter` & `UserClickedASimpleFilter` events when clicked', () => {
    const { wrapper, clickFilter, emit, filter } = renderSimpleFilter();

    clickFilter();

    expect(emit).toHaveBeenCalledTimes(2);
    ['UserClickedAFilter', 'UserClickedASimpleFilter'].forEach(event => {
      expect(emit).toHaveBeenCalledWith(event, filter, { target: wrapper.element });
    });
  });

  it('emits configured events when clicked', () => {
    const { wrapper, clickFilter, emit, filter } = renderSimpleFilter({
      clickEvents: { UserAcceptedAQuery: 'potato' }
    });

    clickFilter();

    expect(emit).toHaveBeenCalledTimes(3);
    ['UserClickedAFilter', 'UserClickedASimpleFilter'].forEach(event => {
      expect(emit).toHaveBeenCalledWith(event, filter, { target: wrapper.element });
    });
    expect(emit).toHaveBeenNthCalledWith(3, 'UserAcceptedAQuery', 'potato', {
      target: wrapper.element
    });
  });

  it('allows customizing the default button content', () => {
    const { wrapper, filter } = renderSimpleFilter({
      template: `
      <SimpleFilter :filter="filter" :clickEvents="clickEvents">
        <template #label="{ filter }">
          <span data-test="custom-label">{{ filter.label }}</span>
        </template>
      </SimpleFilter>
      `
    });

    const customLabel = wrapper.find(getDataTestSelector('custom-label'));
    expect(customLabel.text()).toEqual(filter.label);
  });

  it('allows replacing the root element of the component', () => {
    const { wrapper, emit, filter } = renderSimpleFilter({
      template: `
      <SimpleFilter :filter="filter" :clickEvents="clickEvents" v-slot="{ filter, clickFilter }">
        <label data-test="label">
          <input data-test="input"
            type="checkbox"
            @change="clickFilter"
          />
          {{ filter.label }}
        </label>
      </SimpleFilter>
      `
    });
    const labelWrapper = wrapper.get(getDataTestSelector('label'));
    const inputWrapper = wrapper.get(getDataTestSelector('input'));

    expect(labelWrapper.text()).toBe(filter.label);

    inputWrapper.trigger('change');
    expect(emit).toHaveBeenCalledTimes(2);
    ['UserClickedAFilter', 'UserClickedASimpleFilter'].forEach(event => {
      expect(emit).toHaveBeenCalledWith(event, filter, { target: wrapper.element });
    });
  });

  it('exposes proper css classes and attributes in the default slot', async () => {
    const { wrapper, selectFilter, updateFilter } = renderSimpleFilter({
      template: `
      <SimpleFilter
        :filter="filter"
        :clickEvents="clickEvents"
        v-slot="{ filter, clickFilter, isDisabled, cssClasses }"
      >
        <button data-test="button"
          :class="cssClasses"
          :disabled="isDisabled"
          :aria-checked="filter.selected.toString()">
          {{ filter.label }}
        </button>
      </SimpleFilter>
      `
    });
    const buttonWrapper = wrapper.get(getDataTestSelector('button'));

    expect(buttonWrapper.classes()).toHaveLength(2);
    expect(buttonWrapper.classes()).toEqual(
      expect.arrayContaining(['x-facet-filter', 'x-simple-filter'])
    );
    expect(buttonWrapper.attributes()).toHaveProperty('aria-checked', 'false');
    expect(buttonWrapper.element).toHaveProperty('disabled', false);

    await selectFilter(); // Faking filter selection because XBus is mocked.
    expect(buttonWrapper.attributes('aria-checked')).toBe('true');
    expect(buttonWrapper.classes()).toHaveLength(4);
    expect(buttonWrapper.classes()).toEqual(
      expect.arrayContaining([
        'x-facet-filter',
        'x-simple-filter',
        'x-selected',
        'x-simple-filter--is-selected'
      ])
    );

    await updateFilter({ totalResults: 0 });
    expect(buttonWrapper.element).toHaveProperty('disabled', true);

    await updateFilter({ totalResults: undefined });
    expect(buttonWrapper.element).toHaveProperty('disabled', false);
  });

  it('adds selected classes to the rendered element when the filter is selected', async () => {
    const { wrapper, selectFilter } = renderSimpleFilter();

    expect(wrapper.classes()).not.toContain('x-selected');
    expect(wrapper.classes()).not.toContain('x-simple-filter--is-selected');

    await selectFilter();

    expect(wrapper.classes()).toContain('x-selected');
    expect(wrapper.classes()).toContain('x-simple-filter--is-selected');
  });
});

interface RenderSimpleFilterOptions {
  /** The events to emit when the filter is clicked. */
  clickEvents?: Partial<XEventsTypes>;
  /** The filter data to render. */
  filter?: SimpleFilterModel;
  /** Template including the {@link SimpleFilter} to render. */
  template?: string;
}

interface RenderSimpleFilterAPI {
  /** Fakes a click in the {@link SimpleFilter} component. */
  clickFilter: () => void;
  /** Mock for the {@link XBus.emit} function. */
  emit: jest.Mock;
  /** The data rendered. */
  filter: SimpleFilterModel;
  /**
   * Selects the filter.
   *
   * @returns A promise that resolves after Vue updates the view.
   */
  selectFilter: () => Promise<void>;
  /**
   * Updates the rendered filter data.
   *
   * @param newFilter - The new fields to set to the rendered filter.
   * @returns A promise that resolves after Vue updates the view.
   */
  updateFilter: (newFilter: Partial<SimpleFilterModel>) => Promise<void>;
  /** Test wrapper of the {@link SimpleFilter} component. */
  wrapper: Wrapper<Vue>;
}
