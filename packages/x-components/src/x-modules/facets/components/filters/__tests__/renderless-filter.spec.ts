import { mount } from '@vue/test-utils';
import { nextTick, ref } from 'vue';
import { getXComponentXModuleName, isXComponent } from '../../../../../components';
import {
  createSimpleFilter,
  getSimpleFilterStub
} from '../../../../../__stubs__/filters-stubs.factory';
import { getDataTestSelector, installNewXPlugin } from '../../../../../__tests__/utils';
import RenderlessFilter from '../renderless-filter.vue';
import { XPlugin } from '../../../../../plugins/x-plugin';

function renderComponent({
  filter = ref(createSimpleFilter('category', 'food')),
  clickEvents = {},
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
} = {}) {
  installNewXPlugin();

  //Vue.observable(filter);

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
      }
    }
  );

  const renderlessFilterWrapper = wrapper.findComponent(RenderlessFilter);

  return {
    wrapper: renderlessFilterWrapper,
    emit: jest.spyOn(XPlugin.bus, 'emit'),
    filter,
    clickFilter: () => {
      renderlessFilterWrapper.trigger('click');
    },
    selectFilter: async () => {
      filter.value.selected = true;
      await nextTick();
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

    expect(getXComponentXModuleName(wrapper.vm)).toEqual('facets');
  });

  it('emits UserClickedAFilter and other custom events when clicked', () => {
    const filter = ref(getSimpleFilterStub());
    const { wrapper, clickFilter, emit } = renderComponent({
      filter,
      clickEvents: {
        UserClickedASimpleFilter: filter.value
      }
    });

    clickFilter();

    expect(emit).toHaveBeenCalledTimes(2);
    expect(emit).toHaveBeenCalledWith('UserClickedAFilter', filter.value, {
      target: wrapper.element
    });
    expect(emit).toHaveBeenCalledWith('UserClickedASimpleFilter', filter.value, {
      target: wrapper.element
    });
  });

  it('allows customizing the rendered content with an slot', () => {
    const { wrapper, filter } = renderComponent();

    const customLabel = wrapper.find(getDataTestSelector('custom-label'));
    expect(customLabel.text()).toEqual(filter.value.label);
  });

  it('adds selected classes to the rendered element when the filter is selected', async () => {
    const { wrapper, selectFilter } = renderComponent();

    expect(wrapper.classes()).not.toContain('x-selected');

    await selectFilter();

    expect(wrapper.classes()).toContain('x-selected');
  });

  it('disables the filter when it has no results', async () => {
    const filter = ref(createSimpleFilter('category', 'men', false));
    const { wrapper } = renderComponent({ filter });

    expect(wrapper.attributes('disabled')).toBeUndefined();

    filter.value.totalResults = 0;
    await nextTick();

    expect(wrapper.attributes('disabled')).toBe('disabled');
  });
});
