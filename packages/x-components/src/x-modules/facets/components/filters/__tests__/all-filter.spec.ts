import { Facet } from '@empathy/search-types';
import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { getXComponentXModuleName, isXComponent } from '../../../../../components';
import { XPlugin } from '../../../../../plugins/x-plugin';
import { getSimpleFacetStub } from '../../../../../__stubs__/facets-stubs.factory';
import { installNewXPlugin } from '../../../../../__tests__/utils';
import AllFilter from '../all-filter.vue';
/**
 * Renders the `AllFilter` component, exposing a basic API for testing.
 *
 * @param options - The options to render the component with.
 * @returns The API for testing the `AllFilter` component.
 */
function renderAllFilter({
  template = `<AllFilter :facet="facet"></AllFilter>`
}: RenderAllFilterOptions = {}): RenderAllFilterAPI {
  const facet = getSimpleFacetStub();
  Vue.observable(facet);

  const localVue = createLocalVue();
  installNewXPlugin({}, localVue);
  XPlugin.resetInstance();

  const wrapper = mount(
    {
      components: {
        AllFilter
      },
      template,
      props: ['facet']
    },
    {
      localVue,
      propsData: {
        facet
      }
    }
  );

  const allFilterWrapper = wrapper.findComponent(AllFilter);

  return {
    wrapper,
    allFilterWrapper,
    facet,
    toggleFirstFilter() {
      facet.filters[0].selected = !facet.filters[0].selected;
      return wrapper.vm.$nextTick();
    },
    clickAllFilter() {
      allFilterWrapper.trigger('click');
      return wrapper.vm.$nextTick();
    }
  };
}

describe('testing AllFilter component', () => {
  it('is an x-component', () => {
    const { allFilterWrapper } = renderAllFilter();

    expect(isXComponent(allFilterWrapper.vm)).toEqual(true);
  });

  it('belongs to the `facets` x-module', () => {
    const { allFilterWrapper } = renderAllFilter();

    expect(getXComponentXModuleName(allFilterWrapper.vm)).toEqual('facets');
  });

  it('has x-all-filter--selected class while no filters are selected', async () => {
    const { allFilterWrapper, toggleFirstFilter } = renderAllFilter();
    expect(allFilterWrapper.classes('x-all-filter--selected')).toBe(true);
    await toggleFirstFilter();
    expect(allFilterWrapper.classes('x-all-filter--selected')).toBe(false);
    await toggleFirstFilter();
    expect(allFilterWrapper.classes('x-all-filter--selected')).toBe(true);
  });

  it('emits UserClickedFacetAllFilter event with the facet id as payload', async () => {
    const { wrapper, toggleFirstFilter, clickAllFilter, facet } = renderAllFilter();
    const listenerAllFilter = jest.fn();
    wrapper.vm.$x.on('UserClickedFacetAllFilter', true).subscribe(listenerAllFilter);
    await toggleFirstFilter();
    expect(listenerAllFilter).toHaveBeenCalledTimes(0);
    await clickAllFilter();
    expect(listenerAllFilter).toHaveBeenCalledTimes(1);
    expect(listenerAllFilter).toHaveBeenNthCalledWith(1, {
      eventPayload: facet.id,
      metadata: {
        moduleName: 'facets',
        target: wrapper.element
      }
    });
  });

  it('renders default content', () => {
    const { allFilterWrapper } = renderAllFilter();
    expect(allFilterWrapper.text()).toBe('all');
  });

  it('renders default slot custom content', () => {
    const { allFilterWrapper, facet } = renderAllFilter({
      template: `
        <AllFilter v-slot="{ facet }" :facet="facet" >
          Select all {{ facet.label }}
        </AllFilter>
      `
    });
    expect(allFilterWrapper.text()).toBe(`Select all ${facet.label}`);
  });
});

interface RenderAllFilterOptions {
  /** The template to be rendered. */
  template?: string;
}

interface RenderAllFilterAPI {
  /** The wrapper of the container element.*/
  wrapper: Wrapper<Vue>;
  /** The `AllFilter` wrapper component. */
  allFilterWrapper: Wrapper<Vue>;
  /** Current facet passed as prop to the AllFilter component. */
  facet: Facet;
  /** Function that toggles first filter selected property. */
  toggleFirstFilter: () => Promise<void>;
  /** Function that clicks all filter button. */
  clickAllFilter: () => Promise<void>;
}
