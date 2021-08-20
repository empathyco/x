import { Facet } from '@empathyco/x-types-next';
import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { createNextSimpleFacetStub } from '../../../../../__stubs__/facets-stubs.factory';
import { installNewXPlugin } from '../../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../../../../../components';
import { RootXStoreState } from '../../../../../store/store.types';
import { arrayToObject } from '../../../../../utils/array';
import { facetsNextXModule } from '../../../x-module';
import { resetXFacetsStateWith } from '../../__tests__/utils';
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
  const facet = createNextSimpleFacetStub('category', createFilter => [
    createFilter('men'),
    createFilter('women')
  ]);

  const localVue = createLocalVue();
  localVue.use(Vuex);
  const store = new Store<RootXStoreState>({});
  installNewXPlugin({ store, initialXModules: [facetsNextXModule] }, localVue);
  resetXFacetsStateWith(store, {
    facets: {
      [facet.id]: facet
    },
    filters: arrayToObject(facet.filters, 'id')
  });

  const wrapper = mount(
    {
      components: {
        AllFilter
      },
      template,
      props: ['facet']
    },
    {
      store,
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
      wrapper.vm.$x.emit(
        'UserClickedANextFilter',
        store.state.x.facetsNext.filters[facet.filters[0].id]
      );
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

  it('belongs to the `facetsNext` x-module', () => {
    const { allFilterWrapper } = renderAllFilter();

    expect(getXComponentXModuleName(allFilterWrapper.vm)).toEqual('facetsNext');
  });

  it('has x-all-filter--is-selected class while no filters are selected', async () => {
    const { allFilterWrapper, toggleFirstFilter } = renderAllFilter();
    expect(allFilterWrapper.classes('x-all-filter--is-selected')).toBe(true);
    // Some filter should be selected now, so the all filter should be deselected.
    await toggleFirstFilter();
    expect(allFilterWrapper.classes('x-all-filter--is-selected')).toBe(false);
    // No filter should be selected now, so the all filter should be selected.
    await toggleFirstFilter();
    expect(allFilterWrapper.classes('x-all-filter--is-selected')).toBe(true);
  });

  it('emits `UserClickedAllFilter` event with the facet id as payload', async () => {
    const { wrapper, toggleFirstFilter, clickAllFilter, facet } = renderAllFilter();
    const listenerAllFilter = jest.fn();
    wrapper.vm.$x.on('UserClickedAllFilter', true).subscribe(listenerAllFilter);
    await toggleFirstFilter();
    expect(listenerAllFilter).toHaveBeenCalledTimes(0);

    await clickAllFilter();
    expect(listenerAllFilter).toHaveBeenCalledTimes(1);
    expect(listenerAllFilter).toHaveBeenNthCalledWith(1, {
      eventPayload: [facet.id],
      metadata: {
        moduleName: 'facetsNext',
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
  /** The `AllFilter` wrapper component. */
  allFilterWrapper: Wrapper<Vue>;
  /** Function that clicks all filter button. */
  clickAllFilter: () => Promise<void>;
  /** Current facet passed as prop to the AllFilter component. */
  facet: Facet;
  /** Function that toggles first filter selected property. */
  toggleFirstFilter: () => Promise<void>;
  /** The wrapper of the container element.*/
  wrapper: Wrapper<Vue>;
}
