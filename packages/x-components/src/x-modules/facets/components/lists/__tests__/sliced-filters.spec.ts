import { Filter } from '@empathyco/x-types';
import { mount, VueWrapper, DOMWrapper } from '@vue/test-utils';
import { createSimpleFilter } from '../../../../../__stubs__';
import { getDataTestSelector } from '../../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../../../../../components';
import SlicedFilters from '../sliced-filters.vue';

/**
 * Renders the `BaseShowMoreFilters` component, exposing a basic API for testing.
 *
 * @param options - The options to render the component with.
 * @returns The API for testing the `BaseShowMoreFilters` component.
 */
function renderBaseShowMoreFilters({
  max = 10,
  buttonClass
}: BaseShowMoreFiltersOptions = {}): BaseShowMoreFiltersAPI {
  const filtersMock: Filter[] = [
    'Lego city',
    'Lego city 2',
    'Lego star wars"',
    'Lego batman',
    'Lego batman 2',
    'Lego construccion',
    'Lego coleccionista',
    'Lego nuevo'
  ].map(label => createSimpleFilter('category', label));

  const wrapper = mount(
    {
      components: { SlicedFilters },
      props: ['filters', 'max', 'buttonClass'],
      template: `
          <SlicedFilters :filters="filters" :max="max" :buttonClass="buttonClass">
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
      props: {
        filters: filtersMock,
        max,
        buttonClass
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
    const { getFiltersWrapper, getShowMoreButton, getShowLessButton } = renderBaseShowMoreFilters({
      max: 2
    });

    expect(getFiltersWrapper()).toHaveLength(2);
    expect(getShowMoreButton().text()).toEqual('Expand 6 more filters');

    await getShowMoreButton().trigger('click');

    expect(getFiltersWrapper()).toHaveLength(8);
    expect(getShowLessButton().text()).toEqual('Expand 6 less filters');

    await getShowLessButton().trigger('click');

    expect(getFiltersWrapper()).toHaveLength(2);
  });

  it('emits Vue events when the show more/less buttons are clicked', async () => {
    const { filterWrapper, getShowMoreButton, getShowLessButton } = renderBaseShowMoreFilters({
      max: 2
    });

    expect(filterWrapper.emitted('click:show-more')).toBeUndefined();
    expect(filterWrapper.emitted('click:show-less')).toBeUndefined();

    await getShowMoreButton().trigger('click');
    expect(filterWrapper.emitted('click:show-more')).toEqual([[expect.any(MouseEvent)]]);

    await getShowLessButton().trigger('click');
    expect(filterWrapper.emitted('click:show-less')).toEqual([[expect.any(MouseEvent)]]);
  });

  it('allows to add classes to the show more/less buttons', async () => {
    const { getShowLessButton, getShowMoreButton } = renderBaseShowMoreFilters({
      max: 2,
      buttonClass: 'custom-class'
    });

    expect(getShowMoreButton().classes('custom-class')).toBe(true);

    await getShowMoreButton().trigger('click');

    expect(getShowLessButton().classes('custom-class')).toBe(true);
  });
});

interface BaseShowMoreFiltersOptions {
  /** The number filters to show. */
  max?: number;
  /** The class to add to the show more/less buttons. */
  buttonClass?: string;
}

interface BaseShowMoreFiltersAPI {
  /** The wrapper of the container element. */
  wrapper: VueWrapper;
  /** The wrapper of the container element. */
  filterWrapper: VueWrapper;
  /** The filters of the wrapper element. */
  getFiltersWrapper: () => DOMWrapper<Element>[];
  /** The show more button of the wrapper element. */
  getShowMoreButton: () => DOMWrapper<Element>;
  /** The show less button of the wrapper element. */
  getShowLessButton: () => DOMWrapper<Element>;
}
