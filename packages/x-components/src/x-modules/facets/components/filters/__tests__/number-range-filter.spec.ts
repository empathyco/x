import { mount } from '@vue/test-utils';
import { nextTick, ref } from 'vue';
import { createNumberRangeFilter } from '../../../../../__stubs__/filters-stubs.factory';
import { getDataTestSelector, installNewXPlugin } from '../../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../../../../../components';
import NumberRangeFilter from '../number-range-filter.vue';
import { XPlugin } from '../../../../../plugins/index';

const metadata = {
  moduleName: 'facets',
  location: 'none',
  replaceable: true
};

function render({
  template = '<NumberRangeFilter :filter="filter" :clickEvents="clickEvents" />',
  filter = ref(createNumberRangeFilter('price', { min: 0, max: 20 })),
  clickEvents = {}
} = {}) {
  installNewXPlugin();

  const wrapper = mount(
    {
      components: { NumberRangeFilter },
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

  const filterWrapper = wrapper.findComponent(NumberRangeFilter);

  return {
    wrapper,
    filterWrapper,
    emitSpy: jest.spyOn(XPlugin.bus, 'emit'),
    filter,
    clickFilter: () => {
      wrapper.trigger('click');
    },
    selectFilter: () => {
      filter.value.selected = true;
      return nextTick();
    }
  };
}

describe('testing NumberRangeFilter component', () => {
  it('is an x-component', () => {
    const { filterWrapper } = render();

    expect(isXComponent(filterWrapper.vm)).toEqual(true);
  });

  it('belongs to the `facets` x-module', () => {
    const { filterWrapper } = render();

    expect(getXComponentXModuleName(filterWrapper.vm)).toEqual('facets');
  });

  it('renders the provided filter by default', () => {
    const { wrapper, filter } = render();

    expect(wrapper.text()).toEqual(filter.value.label);
  });

  it('emits `UserClickedAFilter` & `UserClickedANumberRangeFilter` events when clicked', () => {
    const { clickFilter, emitSpy, filter } = render();

    clickFilter();

    expect(emitSpy).toHaveBeenCalledTimes(2);
    ['UserClickedAFilter', 'UserClickedANumberRangeFilter'].forEach(event => {
      expect(emitSpy).toHaveBeenCalledWith(event, filter.value, metadata);
    });
  });

  it('emits configured events when clicked', () => {
    const { clickFilter, emitSpy, filter } = render({
      clickEvents: { UserAcceptedAQuery: 'potato' }
    });

    clickFilter();

    expect(emitSpy).toHaveBeenCalledTimes(3);
    ['UserClickedAFilter', 'UserClickedANumberRangeFilter'].forEach(event => {
      expect(emitSpy).toHaveBeenCalledWith(event, filter.value, metadata);
    });
    expect(emitSpy).toHaveBeenNthCalledWith(3, 'UserAcceptedAQuery', 'potato', metadata);
  });

  it('allows customizing the rendered content with an slot', () => {
    const { wrapper, filter } = render({
      template: `
      <NumberRangeFilter :filter="filter" :clickEvents="clickEvents" v-slot="{ filter }">
        <span data-test="custom-label">{{ filter.label }}</span>
      </NumberRangeFilter>
      `
    });

    const customLabel = wrapper.find(getDataTestSelector('custom-label'));
    expect(customLabel.text()).toEqual(filter.value.label);
  });

  it('adds selected classes to the rendered element when the filter is selected', async () => {
    const { wrapper, selectFilter } = render();

    expect(wrapper.classes()).not.toContain('x-selected');
    expect(wrapper.classes()).not.toContain('x-number-range-filter--is-selected');

    await selectFilter();

    expect(wrapper.classes()).toContain('x-selected');
    expect(wrapper.classes()).toContain('x-number-range-filter--is-selected');
  });
});
