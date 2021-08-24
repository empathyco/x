import { BooleanFilter } from '@empathyco/x-types-next';
import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { getXComponentXModuleName, isXComponent } from '../../../../../components';
import { XEventsTypes } from '../../../../../wiring/events.types';
import {
  createNextSimpleFilter,
  createSimpleFilter,
  getSimpleFilterStub
} from '../../../../../__stubs__/filters-stubs.factory';
import { getDataTestSelector } from '../../../../../__tests__/utils';
import RenderlessFilter from '../renderless-filter.vue';

function renderComponent({
  filter = createNextSimpleFilter('category', 'food'),
  clickEvents,
  template = `
        <RenderlessFilter
        :filter="filter"
        :clickEvents="clickEvents"
        v-slot="{ filter, clickFilter, cssClasses, isDisabled }">
          <button
            @click="clickFilter"
            :class="cssClasses"
            :disabled="isDisabled"
            data-test="custom-label"
          >
            {{ filter.label }}
          </button>
        </RenderlessFilter>
      `
}: RenderOptions = {}): RenderAPI {
  Vue.observable(filter);
  const emit = jest.fn();
  const wrapper = mount(
    {
      components: { RenderlessFilter },
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

  const renderlessFilterWrapper = wrapper.findComponent(RenderlessFilter);

  return {
    wrapper: renderlessFilterWrapper,
    emit,
    filter,
    clickFilter() {
      renderlessFilterWrapper.trigger('click');
    },
    async selectFilter() {
      filter.selected = true;
      await Vue.nextTick();
    }
  };
}

describe('testing Renderless Filter component', () => {
  it('is an x-component', () => {
    const { wrapper } = renderComponent();

    expect(isXComponent(wrapper.vm)).toEqual(true);
  });

  it('belongs to the `facets` x-module', () => {
    const { wrapper } = renderComponent();

    expect(getXComponentXModuleName(wrapper.vm)).toEqual('facetsNext');
  });

  it('emits UserClickedAFilter and other custom events when clicked', () => {
    const filter = getSimpleFilterStub();
    const { wrapper, clickFilter, emit } = renderComponent({
      filter,
      clickEvents: {
        UserClickedASimpleFilter: filter
      }
    });

    clickFilter();

    expect(emit).toHaveBeenCalledTimes(2);
    expect(emit).toHaveBeenCalledWith('UserClickedANextFilter', filter, {
      target: wrapper.element
    });
    expect(emit).toHaveBeenCalledWith('UserClickedASimpleFilter', filter, {
      target: wrapper.element
    });
  });

  it('allows customizing the rendered content with an slot', () => {
    const { wrapper, filter } = renderComponent();

    const customLabel = wrapper.find(getDataTestSelector('custom-label'));
    expect(customLabel.text()).toEqual(filter.label);
  });

  it('adds selected classes to the rendered element when the filter is selected', async () => {
    const { wrapper, selectFilter } = renderComponent();

    expect(wrapper.classes()).not.toContain('x-filter--is-selected');

    await selectFilter();

    expect(wrapper.classes()).toContain('x-filter--is-selected');
  });

  it('disables the filter when it has no results', async () => {
    const filter = createSimpleFilter('category', 'men', false);
    const { wrapper } = renderComponent({ filter });

    expect(wrapper.classes()).not.toContain('x-filter--is-disabled');
    expect(wrapper.attributes('disabled')).toBeUndefined();

    filter.totalResults = 0;
    await wrapper.vm.$nextTick();

    expect(wrapper.classes()).toContain('x-filter--is-disabled');
    expect(wrapper.attributes('disabled')).toBe('disabled');
  });
});

interface RenderOptions {
  /** The template containing the {@link RenderlessFilter} component to render. */
  template?: string;
  /** The filter data. Passed as prop to the {@link RenderlessFilter} component. */
  filter?: BooleanFilter;
  /** Additional events to emit when the filter is clicked.
   * Passed as prop to the {@link RenderlessFilter} component. */
  clickEvents?: Partial<XEventsTypes>;
}

interface RenderAPI {
  /** Wrapper of the {@link RenderlessFilter} component. */
  wrapper: Wrapper<Vue>;
  /** Mock of the {@link XBus.emit} function. */
  emit: jest.Mock;
  /** The rendered filter data. */
  filter: BooleanFilter;
  /** Fakes a click on the filter component. */
  clickFilter: () => void;
  /** Sets the {@link RenderAPI.filter} `selected` property to `true`. */
  selectFilter: () => Promise<void>;
}
