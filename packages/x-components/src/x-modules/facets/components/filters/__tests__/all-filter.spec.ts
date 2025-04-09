import type { RootXStoreState } from '../../../../../store/store.types'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { Store } from 'vuex'
import { createSimpleFacetStub } from '../../../../../__stubs__/facets-stubs.factory'
import { installNewXPlugin } from '../../../../../__tests__/utils'
import { getXComponentXModuleName, isXComponent } from '../../../../../components'
import { XPlugin } from '../../../../../plugins/index'
import { facetsXModule } from '../../../x-module'
import { resetXFacetsStateWith } from '../../__tests__/utils'
import AllFilter from '../all-filter.vue'

/**
 * Renders the `AllFilter` component, exposing a basic API for testing.
 *
 * @param options - The options to render the component with.
 * @param options.template - template option.
 * @returns The API for testing the `AllFilter` component.
 */
function renderAllFilter({ template = `<AllFilter :facet="facet"></AllFilter>` } = {}) {
  const facet = createSimpleFacetStub('category', createFilter => [
    createFilter('men'),
    createFilter('women'),
  ])

  const store = new Store<RootXStoreState>({})

  const wrapper = mount(
    {
      components: {
        AllFilter,
      },
      template,
      props: ['facet'],
    },
    {
      store,
      global: {
        plugins: [installNewXPlugin({ store, initialXModules: [facetsXModule] })],
      },
      props: {
        facet,
      },
    },
  )

  resetXFacetsStateWith(store, { category: facet })

  const allFilterWrapper = wrapper.findComponent(AllFilter)

  return {
    wrapper,
    allFilterWrapper,
    facet,
    toggleFirstFilter: async () => {
      await XPlugin.bus.emit(
        'UserClickedAFilter',
        store.state.x.facets.filters[facet.filters[0].id],
      )
      return nextTick()
    },
    clickAllFilter: async () => {
      await allFilterWrapper.trigger('click')
      return nextTick()
    },
  }
}

describe('testing AllFilter component', () => {
  it('is an x-component', () => {
    const { allFilterWrapper } = renderAllFilter()

    expect(isXComponent(allFilterWrapper.vm)).toEqual(true)
  })

  it('belongs to the `facets` x-module', () => {
    const { allFilterWrapper } = renderAllFilter()

    expect(getXComponentXModuleName(allFilterWrapper.vm)).toEqual('facets')
  })

  it('has x-all-filter--is-selected class while no filters are selected', async () => {
    const { allFilterWrapper, toggleFirstFilter } = renderAllFilter()
    expect(allFilterWrapper.classes('x-all-filter--is-selected')).toBe(true)
    // Some filter should be selected now, so the all filter should be deselected.
    await toggleFirstFilter()
    expect(allFilterWrapper.classes('x-all-filter--is-selected')).toBe(false)
    // No filter should be selected now, so the all filter should be selected.
    await toggleFirstFilter()
    expect(allFilterWrapper.classes('x-all-filter--is-selected')).toBe(true)
  })

  it('emits `UserClickedAllFilter` event with the facet id as payload', async () => {
    const { wrapper, toggleFirstFilter, clickAllFilter, facet } = renderAllFilter()
    const listenerAllFilter = jest.fn()
    XPlugin.bus.on('UserClickedAllFilter', true).subscribe(listenerAllFilter)
    await toggleFirstFilter()
    expect(listenerAllFilter).toHaveBeenCalledTimes(0)

    await clickAllFilter()
    expect(listenerAllFilter).toHaveBeenCalledTimes(1)
    expect(listenerAllFilter).toHaveBeenNthCalledWith(1, {
      eventPayload: [facet.id],
      metadata: {
        moduleName: 'facets',
        target: wrapper.element,
        location: 'none',
        replaceable: true,
      },
    })
  })

  it('renders default content', () => {
    const { allFilterWrapper } = renderAllFilter()
    expect(allFilterWrapper.text()).toBe('all')
  })

  it('renders default slot custom content', () => {
    const { allFilterWrapper, facet } = renderAllFilter({
      template: `
        <AllFilter v-slot="{ facet }" :facet="facet" >
          Select all {{ facet.label }}
        </AllFilter>`,
    })
    expect(allFilterWrapper.text()).toBe(`Select all ${facet.label}`)
  })
})
