import { SimpleFilter as SimpleFilterModel } from '@empathy/search-types';
import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { getSimpleFilterStub } from '../../../../../__stubs__/filters-stubs.factory';
import { getDataTestSelector } from '../../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../../../../../components';
import SimpleFilter from '../simple-filter.vue';

function renderSimpleFilter({
  template = '<SimpleFilter :filter="filter"/>',
  filter = getSimpleFilterStub()
}: SimpleFilterWrapperData = {}): SimpleFilterAPI {
  Vue.observable(filter);
  const emit = jest.fn();
  const wrapper = mount(
    {
      components: { SimpleFilter },
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

  const filterWrapper = wrapper.findComponent(SimpleFilter);

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

describe('testing SimpleFilter component', () => {
  it('is an x-component', () => {
    const { filterWrapper } = renderSimpleFilter();

    expect(isXComponent(filterWrapper.vm)).toEqual(true);
  });

  it('belongs to the `facets` x-module', () => {
    const { filterWrapper } = renderSimpleFilter();

    expect(getXComponentXModuleName(filterWrapper.vm)).toEqual('facets');
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

  it('allows customizing the rendered content with an slot', () => {
    const { wrapper, filter } = renderSimpleFilter({
      template: `
      <SimpleFilter :filter="filter" v-slot="{ filter }">
        <span data-test="custom-label">{{ filter.label }}</span>
      </SimpleFilter>
      `
    });

    const customLabel = wrapper.find(getDataTestSelector('custom-label'));
    expect(customLabel.text()).toEqual(filter.label);
  });

  it('adds selected classes to the rendered element when the filter is selected', async () => {
    const { wrapper, selectFilter } = renderSimpleFilter();

    expect(wrapper.classes()).not.toContain('x-filter--is-selected');
    expect(wrapper.classes()).not.toContain('x-simple-filter--is-selected');

    await selectFilter();

    expect(wrapper.classes()).toContain('x-filter--is-selected');
    expect(wrapper.classes()).toContain('x-simple-filter--is-selected');
  });
});

interface SimpleFilterWrapperData {
  template?: string;
  filter?: SimpleFilterModel;
}

interface SimpleFilterAPI {
  wrapper: Wrapper<Vue>;
  filterWrapper: Wrapper<Vue>;
  emit: jest.Mock;
  filter: SimpleFilterModel;
  clickFilter: () => void;
  selectFilter: () => Promise<void>;
}
