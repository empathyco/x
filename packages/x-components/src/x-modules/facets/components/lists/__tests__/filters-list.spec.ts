import type { SimpleFilter } from '@empathyco/x-types'
import { mount } from '@vue/test-utils'
import { createSimpleFacetStub } from '../../../../../__stubs__'
import { getDataTestSelector } from '../../../../../__tests__/utils'
import { getXComponentXModuleName, isXComponent } from '../../../../../components'
import FiltersList from '../filters-list.vue'

function renderFilters({
  filters = [] as SimpleFilter[],
  template = '<Filters :filters="filters"></Filters>',
} = {}) {
  const wrapperTemplate = mount(
    {
      props: ['filters'],
      components: {
        Filters: FiltersList,
      },
      template,
    },
    {
      props: { filters },
    },
  )

  const wrapper = wrapperTemplate.findComponent(FiltersList)

  return {
    wrapper,
    filters,
  }
}

describe('testing Filters component', () => {
  it('is an x-component', () => {
    const { wrapper } = renderFilters()

    expect(isXComponent(wrapper.vm)).toEqual(true)
  })

  it('belongs to the `facets` x-module', () => {
    const { wrapper } = renderFilters()

    expect(getXComponentXModuleName(wrapper.vm)).toEqual('facets')
  })

  it('does not render anything when filters are empty', () => {
    const { wrapper } = renderFilters()
    expect(wrapper.find(getDataTestSelector('base-filters')).exists()).toBe(false)
  })

  it('renders scoped slot correctly', () => {
    const filters = createSimpleFacetStub('color', createFilter => [
      createFilter('red'),
      createFilter('blue'),
      createFilter('green'),
    ]).filters
    const { wrapper } = renderFilters({
      filters,
      template: `
        <Filters :filters="filters" #default="{ filter }">
          <p>{{ filter.label }}</p>
        </Filters>
      `,
    })

    const liWrappers = wrapper.findAll(getDataTestSelector('base-filters-item'))
    filters.forEach((filter, index) => {
      expect(liWrappers.at(index)?.text()).toContain(filter.label)
    })
  })
})
