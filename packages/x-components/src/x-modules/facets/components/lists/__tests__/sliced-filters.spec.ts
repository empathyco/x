import { Filter } from '@empathyco/x-types-old';
import { mount, Wrapper, WrapperArray } from '@vue/test-utils';
import Vue from 'vue';
import { createCategorySimpleFilter } from '../../../../../__stubs__/filters-stubs.factory';
import { getDataTestSelector } from '../../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../../../../../components';
import SlicedFilters from '../sliced-filters.vue';

/**
 * Renders the `BaseShowMoreFilters` component, exposing a basic API for testing.
 *
 * @param max - The number filters to show.
 * @returns The API for testing the `BaseShowMoreFilters` component.
 */
function renderBaseShowMoreFilters(max = 10): BaseShowMoreFiltersAPI {
  const filtersMock: Filter[] = [
    'Lego city',
    'Lego city 2',
    'Lego star wars"',
    'Lego batman',
    'Lego batman 2',
    'Lego construccion',
    'Lego coleccionista',
    'Lego nuevo'
  ].map(label => createCategorySimpleFilter(label));

  const wrapper = mount(
    {
      components: { SlicedFilters },
      props: ['filters', 'max'],
      template: `
          <SlicedFilters :filters="filters" :max="max">
            <template #default="{ slicedFilters }">
              <ul v-for="filter in slicedFilters" data-test="sliced-filters-list">
                <li data-test="sliced-filters-list-item">{{ filter.label }}</li>
              </ul>
            </template>
            <template #show-more="{ difference }">Expand {{ difference }} more filters</template>
            <template #show-less="{ difference }">Expand {{ difference }} less filters</template>
          </SlicedFilters>
        `
    },
    {
      propsData: {
        filters: filtersMock,
        max: max
      }
    }
  );

  const filterWrapper = wrapper.findComponent(SlicedFilters);

  return {
    wrapper,
    filterWrapper,
    getFiltersWrapper: () => wrapper.findAll(getDataTestSelector('sliced-filters-list-item')),
    getShowMoreButton: () => wrapper.find(getDataTestSelector('sliced-filters-show-more-button')),
    getShowLessButton: () => wrapper.find(getDataTestSelector('sliced-filters-show-less-button'))
  };
}

describe('testing BaseShowMoreFilters', () => {
  it('is an x-component', () => {
    const { filterWrapper } = renderBaseShowMoreFilters();

    expect(isXComponent(filterWrapper.vm)).toEqual(true);
  });

  it('belongs to the `facets` x-module', () => {
    const { filterWrapper } = renderBaseShowMoreFilters();

    expect(getXComponentXModuleName(filterWrapper.vm)).toEqual('facets');
  });

  it('renders all filters if they are less than the max prop', () => {
    const { wrapper, getFiltersWrapper } = renderBaseShowMoreFilters();

    expect(getFiltersWrapper()).toHaveLength(8);
    expect(wrapper.find(getDataTestSelector('sliced-filters-show-more-button')).exists()).toBe(
      false
    );
    expect(wrapper.find(getDataTestSelector('sliced-filters-show-less-button')).exists()).toBe(
      false
    );
  });

  it('slices the filters when the show more/less buttons are clicked', async () => {
    const { getFiltersWrapper, getShowMoreButton, getShowLessButton } =
      renderBaseShowMoreFilters(2);

    expect(getFiltersWrapper()).toHaveLength(2);
    expect(getShowMoreButton().text()).toEqual('Expand 6 more filters');

    await getShowMoreButton().trigger('click');

    expect(getFiltersWrapper()).toHaveLength(8);
    expect(getShowLessButton().text()).toEqual('Expand 6 less filters');

    await getShowLessButton().trigger('click');

    expect(getFiltersWrapper()).toHaveLength(2);
  });

  it('emits Vue events when the show more/less buttons are clicked', async () => {
    const { filterWrapper, getShowMoreButton, getShowLessButton } = renderBaseShowMoreFilters(2);

    expect(filterWrapper.emitted('click:show-more')).toBeUndefined();
    expect(filterWrapper.emitted('click:show-less')).toBeUndefined();

    await getShowMoreButton().trigger('click');
    expect(filterWrapper.emitted('click:show-more')).toEqual([[expect.any(MouseEvent)]]);

    await getShowLessButton().trigger('click');
    expect(filterWrapper.emitted('click:show-less')).toEqual([[expect.any(MouseEvent)]]);
  });
});

interface BaseShowMoreFiltersAPI {
  /** The wrapper of the container element. */
  wrapper: Wrapper<Vue>;
  /** The wrapper of the container element. */
  filterWrapper: Wrapper<Vue>;
  /** The filters of the wrapper element. */
  getFiltersWrapper: () => WrapperArray<Vue>;
  /** The show more button of the wrapper element. */
  getShowMoreButton: () => Wrapper<Vue>;
  /** The show less button of the wrapper element. */
  getShowLessButton: () => Wrapper<Vue>;
}
