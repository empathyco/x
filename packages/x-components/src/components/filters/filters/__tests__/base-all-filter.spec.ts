import { Facet } from '@empathy/search-types';
import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { XPlugin } from '../../../../plugins/index';
import { getSimpleFacetStub } from '../../../../__stubs__/facets-stubs.factory';
import { installNewXPlugin } from '../../../../__tests__/utils';
import BaseAllFilter from '../base-all-filter.vue';
/**
 * Renders the `AllFilter` component, exposing a basic API for testing.
 *
 * @param options - The options to render the component with.
 * @returns The API for testing the `AllFilter` component.
 */
function renderBaseAllFilter({
  template = `<BaseAllFilter :facet="facet"></BaseAllFilter>`
}: RenderAllFilterOptions = {}): RenderAllFilterAPI {
  const facet = getSimpleFacetStub();
  Vue.observable(facet);

  const localVue = createLocalVue();
  installNewXPlugin({}, localVue);
  XPlugin.resetInstance();

  const wrapper = mount(
    {
      components: {
        BaseAllFilter
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

  const baseAllFilterWrapper = wrapper.findComponent(BaseAllFilter);

  return {
    wrapper,
    baseAllFilterWrapper,
    facet,
    toggleFirstFilter() {
      facet.filters[0].selected = !facet.filters[0].selected;
      return wrapper.vm.$nextTick();
    },
    clickAllFilter() {
      baseAllFilterWrapper.trigger('click');
      return wrapper.vm.$nextTick();
    }
  };
}

describe('testing BaseAllFilter component', () => {
  it('has x-all-filter--selected class while no filters are selected', async () => {
    const { baseAllFilterWrapper, toggleFirstFilter } = renderBaseAllFilter();
    expect(baseAllFilterWrapper.classes('x-all-filter--selected')).toBe(true);
    await toggleFirstFilter();
    expect(baseAllFilterWrapper.classes('x-all-filter--selected')).toBe(false);
    await toggleFirstFilter();
    expect(baseAllFilterWrapper.classes('x-all-filter--selected')).toBe(true);
  });

  it('emits UserClickedFacetAllFilter event with the facet id as payload', async () => {
    const { wrapper, toggleFirstFilter, clickAllFilter, facet } = renderBaseAllFilter();
    const listenerAllFilter = jest.fn();
    wrapper.vm.$x.on('UserClickedFacetAllFilter', true).subscribe(listenerAllFilter);
    await toggleFirstFilter();
    expect(listenerAllFilter).toHaveBeenCalledTimes(0);
    await clickAllFilter();
    expect(listenerAllFilter).toHaveBeenCalledTimes(1);
    expect(listenerAllFilter).toHaveBeenNthCalledWith(1, {
      eventPayload: facet.id,
      metadata: {
        moduleName: null, // no module registered for this base component
        target: wrapper.element
      }
    });
  });

  it('renders default content', () => {
    const { baseAllFilterWrapper, facet } = renderBaseAllFilter();
    expect(baseAllFilterWrapper.text()).toBe(`≡ ${facet.label}`);
  });

  it('renders default slot custom content', () => {
    const { baseAllFilterWrapper, facet } = renderBaseAllFilter({
      template: `
        <BaseAllFilter v-slot="{ facet }" :facet="facet" >
          Select all {{ facet.label }}
        </BaseAllFilter>
      `
    });
    expect(baseAllFilterWrapper.text()).toBe(`Select all ${facet.label}`);
  });
});

interface RenderAllFilterOptions {
  /** The template to be rendered. */
  template?: string;
}

interface RenderAllFilterAPI {
  /** The wrapper of the container element.*/
  wrapper: Wrapper<Vue>;
  /** The `BaseAllFilter` wrapper component. */
  baseAllFilterWrapper: Wrapper<Vue>;
  /** Current facet passed as prop to the BaseAllFilter component. */
  facet: Facet;
  /** Function that toggles first filter selected property. */
  toggleFirstFilter: () => Promise<void>;
  /** Function that clicks all filter button. */
  clickAllFilter: () => Promise<void>;
}
