import type { Facet } from '@empathyco/x-types'
import type { DeepPartial, Dictionary } from '@empathyco/x-utils'
import type { DOMWrapper } from '@vue/test-utils'
import type Vue from 'vue'
import type { RootXStoreState } from '../../../../../store/store.types'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { Store } from 'vuex'
import { createSimpleFacetStub } from '../../../../../__stubs__/facets-stubs.factory'
import { getDataTestSelector, installNewXPlugin } from '../../../../../__tests__/utils'
import { getXComponentXModuleName, isXComponent } from '../../../../../components/x-component.utils'
import { XPlugin } from '../../../../../plugins/x-plugin'
import { toKebabCase } from '../../../../../utils/string'
import { facetsXModule } from '../../../x-module'
import { resetXFacetsStateWith } from '../../__tests__/utils'
import Facets from '../facets.vue'

describe('testing Facets component', () => {
  it('is an XComponent', () => {
    const { wrapper } = renderFacetsComponent()
    expect(isXComponent(wrapper.vm)).toEqual(true)
  })

  it('has FacetsModule as XModule', () => {
    const { wrapper } = renderFacetsComponent()
    expect(getXComponentXModuleName(wrapper.vm)).toEqual('facets')
  })

  it('does not render anything when facets are empty', () => {
    const { wrapper } = renderFacetsComponent({ facets: {} })
    expect(wrapper.find('facets').exists()).toBe(false)
  })

  it('renders the state facets', async () => {
    const { getDefaultFacets, getStateFacets, getDefaultSelectedFilters } = renderFacetsComponent({
      facets: {
        color_facet: createSimpleFacetStub('color_facet', createSimpleFilter => [
          createSimpleFilter('Red', false),
          createSimpleFilter('Blue', true),
        ]),
        brand_facet: createSimpleFacetStub('brand_facet', createSimpleFilter => [
          createSimpleFilter('Adidas', false),
          createSimpleFilter('Nike', false),
        ]),
      },
    })
    await nextTick()
    const facetWrappers = getDefaultFacets()
    const stateFacets = getStateFacets()
    const facetLabels = stateFacets.map(facet => facet.label)
    const selectedFiltersWrappers = getDefaultSelectedFilters()

    expect(facetWrappers).toHaveLength(stateFacets.length)
    facetWrappers.forEach(facetWrapper => {
      expect(facetLabels).toContain(facetWrapper.element.innerHTML)
    })

    expect(selectedFiltersWrappers).toHaveLength(1)
    expect(selectedFiltersWrappers[0].text()).toEqual('Blue')
  })

  it('allows customizing a facet using a slot named with the facet.id', async () => {
    const customFacetId = 'color_facet'

    const { wrapper, getDefaultFacets } = renderFacetsComponent({
      customFacetSlot: `
          <template #${toKebabCase(customFacetId)}="{ facet, selectedFilters }">
            <p data-test="custom-facet">{{ facet.label }}</p>
            <div data-test="custom-facet-selected-filters">
              <span v-for="filter in selectedFilters">{{ filter.label }}</span>
            </div>
          </template>`,
      facets: {
        [customFacetId]: createSimpleFacetStub(customFacetId, createSimpleFilter => [
          createSimpleFilter('Red', true),
          createSimpleFilter('Blue', true),
        ]),
        brand_facet: createSimpleFacetStub('brand_facet', createSimpleFilter => [
          createSimpleFilter('Adidas', false),
          createSimpleFilter('Nike', false),
        ]),
      },
    })
    await nextTick()
    const customFacetWrapper = wrapper.get(
      getDataTestSelector('custom-facet'),
    ) as DOMWrapper<Element>
    const customSelectedFiltersWrapper = wrapper.get(
      getDataTestSelector('custom-facet-selected-filters'),
    )

    expect(customFacetWrapper.exists()).toBe(true)
    expect(customFacetWrapper.text()).toBe(customFacetId)
    getDefaultFacets().forEach(facet => {
      expect(facet.text()).not.toBe(customFacetId)
    })
    expect(customSelectedFiltersWrapper.text()).toEqual('RedBlue')
  })

  it(
    'allows customizing a facet using a slot named with the facet.modelName together with' +
      'the slots with the facet.id',
    async () => {
      const color_facet = createSimpleFacetStub('color_facet', createSimpleFilter => [
        createSimpleFilter('Red', true),
        createSimpleFilter('Blue', false),
      ])
      const brand_facet = createSimpleFacetStub('brand_facet', createSimpleFilter => [
        createSimpleFilter('Adidas', true),
        createSimpleFilter('Nike', false),
      ])

      const { wrapper } = renderFacetsComponent({
        customFacetSlot: `
          <template #simple-facet="{ facet, selectedFilters }">
            <p data-test="facet-by-model-name">{{ facet.label }}</p>
            <div data-test="selected-filters-by-model-name">
              <span v-for="filter in selectedFilters">{{ filter.label }}</span>
            </div>
          </template>
          <template #brand-facet="{ facet, selectedFilters }">
            <p data-test="facet-by-id">{{ facet.label }}</p>
            <div data-test="selected-filters-by-id">
              <span v-for="filter in selectedFilters">{{ filter.label }}</span>
            </div>
          </template>`,
        facets: { brand_facet, color_facet },
      })
      await nextTick()
      const facetByModelNameWrapper = wrapper.get(
        getDataTestSelector('facet-by-model-name'),
      ) as DOMWrapper<Element>
      const selectedFiltersByModelNameWrapper = wrapper.get(
        getDataTestSelector('selected-filters-by-model-name'),
      )
      const facetByIdWrapper = wrapper.get(
        getDataTestSelector('facet-by-id'),
      ) as DOMWrapper<Element>
      const selectedFiltersByIdWrapper = wrapper.get(getDataTestSelector('selected-filters-by-id'))

      expect(facetByModelNameWrapper.exists()).toBe(true)
      expect(facetByModelNameWrapper.text()).toBe(color_facet.label)
      expect(selectedFiltersByModelNameWrapper.text()).toEqual('Red')

      expect(facetByIdWrapper.exists()).toBe(true)
      expect(facetByIdWrapper.text()).toBe(brand_facet.label)
      expect(selectedFiltersByIdWrapper.text()).toEqual('Adidas')
    },
  )

  describe('filters facets based on renderableFacets prop', () => {
    it('renders all facets when its value is omitted', async () => {
      const { getDefaultFacets } = renderFacetsComponent({
        facets: {
          color: createSimpleFacetStub('color', createSimpleFilter => [
            createSimpleFilter('Red', false),
            createSimpleFilter('Blue', false),
          ]),
          size: createSimpleFacetStub('size', createSimpleFilter => [
            createSimpleFilter('Big', false),
            createSimpleFilter('Small', false),
          ]),
        },
      })
      await nextTick()

      const facetWrappers = getDefaultFacets()
      expect(facetWrappers).toHaveLength(2)
      getDefaultFacets().forEach(facetWrapper => {
        expect(['color', 'size']).toContain(facetWrapper.text())
      })
    })

    it('renders only included facets', async () => {
      const { getDefaultFacets } = renderFacetsComponent({
        facets: {
          color_facet: createSimpleFacetStub('color_facet', createSimpleFilter => [
            createSimpleFilter('Red', false),
            createSimpleFilter('Blue', true),
          ]),
          brand_facet: createSimpleFacetStub('brand_facet', createSimpleFilter => [
            createSimpleFilter('Adidas', false),
            createSimpleFilter('Nike', false),
          ]),
          price_facet: createSimpleFacetStub('price_facet', createSimpleFilter => [
            createSimpleFilter('< 10 €', false),
            createSimpleFilter('10 - 50 €', false),
          ]),
        },
        renderableFacets: 'color_facet',
      })
      await nextTick()
      const facetWrappers = getDefaultFacets()
      expect(facetWrappers).toHaveLength(1)
      getDefaultFacets().forEach(facetWrapper => {
        expect(['color_facet']).toContain(facetWrapper.text())
      })
    })

    it('does not render excluded facets', async () => {
      const { getDefaultFacets } = renderFacetsComponent({
        facets: {
          color: createSimpleFacetStub('color', createSimpleFilter => [
            createSimpleFilter('Red', false),
            createSimpleFilter('Blue', false),
          ]),
          size: createSimpleFacetStub('size', createSimpleFilter => [
            createSimpleFilter('Big', false),
            createSimpleFilter('Small', false),
          ]),
          price: createSimpleFacetStub('price', createSimpleFilter => [
            createSimpleFilter('< 10 €', false),
            createSimpleFilter('10 - 50 €', false),
          ]),
        },
        renderableFacets: '!color',
      })
      await nextTick()
      const facetWrappers = getDefaultFacets()
      expect(facetWrappers).toHaveLength(2)
      getDefaultFacets().forEach(facetWrapper => {
        expect(['size', 'price']).toContain(facetWrapper.text())
      })
    })

    it('renders only included facets when combining with excluded ones', async () => {
      const { getDefaultFacets } = renderFacetsComponent({
        facets: {
          color: createSimpleFacetStub('color', createSimpleFilter => [
            createSimpleFilter('Red', false),
            createSimpleFilter('Blue', false),
          ]),
          size: createSimpleFacetStub('size', createSimpleFilter => [
            createSimpleFilter('Big', false),
            createSimpleFilter('Small', false),
          ]),
          price: createSimpleFacetStub('price', createSimpleFilter => [
            createSimpleFilter('< 10 €', false),
            createSimpleFilter('10 - 50 €', false),
          ]),
        },
        renderableFacets: 'color,!price',
      })
      await nextTick()
      const facetWrappers = getDefaultFacets()
      expect(facetWrappers).toHaveLength(1)
      getDefaultFacets().forEach(facetWrapper => {
        expect(['color']).toContain(facetWrapper.text())
      })
    })
  })
})

function renderFacetsComponent({
  customFacetSlot = '',
  components,
  facets = {},
  renderableFacets,
  template = `
       <Facets
        :renderableFacets="renderableFacets"
       >
          ${customFacetSlot ?? ''}
          <template #default="{ facet, selectedFilters }">
            <p data-test="default-slot-facet">{{ facet.label }}</p>
            <div v-if="selectedFilters.length > 0" data-test="default-slot-selected-filters">
              <span v-for="filter in selectedFilters">
                {{ filter.label }}
              </span>
            </div>
          </template>
       </Facets>`,
}: FacetsRenderOptions = {}) {
  const store = new Store<DeepPartial<RootXStoreState>>({})

  const facetWrapper = mount(
    {
      components: {
        Facets,
        ...components,
      },
      props: ['renderableFacets'],
      template,
    },
    {
      global: {
        plugins: [installNewXPlugin({ store, initialXModules: [facetsXModule] })],
      },
      store,
      props: {
        renderableFacets,
      },
    },
  )

  XPlugin.registerXModule(facetsXModule)
  resetXFacetsStateWith(store, facets)
  const wrapper = facetWrapper.findComponent(Facets)

  return {
    wrapper,
    facetWrapper,
    getStateFacets() {
      return Object.values(facets)
    },
    getDefaultFacets() {
      return wrapper.findAll(getDataTestSelector('default-slot-facet'))
    },
    getDefaultSelectedFilters() {
      return wrapper.findAll(getDataTestSelector('default-slot-selected-filters'))
    },
  }
}

interface FacetsRenderOptions {
  components?: Dictionary<typeof Vue>
  customFacetSlot?: string
  facets?: Dictionary<Facet>
  renderableFacets?: string
  template?: string
}
