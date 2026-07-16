import type { DeepPartial } from '@empathyco/x-utils'
import type { Ref } from 'vue'
import type { RootXStoreState } from '../../../../store'
import type { ListItem } from '../../../../utils/types'
import type { SearchState } from '../../../search/store/types'
import type { VendorState } from '../../store/types'
import type { VendorResult } from '../../types'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { computed, defineComponent, inject, nextTick, provide } from 'vue'
import { Store } from 'vuex'
import { getResultsStub } from '../../../../__stubs__'
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils'
import { getXComponentXModuleName, isXComponent, LIST_ITEMS_KEY } from '../../../../components'
import { searchXStoreModule } from '../../../search/store/module'
import { searchXModule } from '../../../search/x-module'
import { vendorXStoreModule } from '../../store/module'
import { vendorXModule } from '../../x-module'
import VendorResultsList from '../vendor-results-list.vue'

function createVendorResultStub(id: string, result?: Partial<VendorResult>): VendorResult {
  return {
    id: `vr-${id}`,
    modelName: 'VendorResult',
    position: 1,
    ...result,
  }
}

async function render({
  template = '<VendorResultsList />',
  results = [] as VendorResult[],
  searchResults = getResultsStub(),
  totalResults = 100,
  components = {},
}: {
  template?: string
  results?: VendorResult[]
  searchResults?: any
  totalResults?: number
  components?: Record<string, any>
} = {}) {
  const store = new Store<DeepPartial<RootXStoreState>>({})

  const wrapper = mount(
    {
      components: { VendorResultsList, ...components },
      template,
    },
    {
      global: {
        plugins: [installNewXPlugin({ store, initialXModules: [searchXModule, vendorXModule] })],
      },
    },
  )
  store.replaceState({
    x: {
      search: {
        ...searchXStoreModule.state(),
        results: searchResults,
        totalResults,
      } as SearchState,
      vendor: { ...vendorXStoreModule.state(), results } as VendorState,
    },
  } as any)
  await nextTick()

  return {
    wrapper: wrapper.findComponent(VendorResultsList),
    results,
    searchResults,
  }
}

describe('testing VendorResultsList component', () => {
  it('is an XComponent which has an XModule', async () => {
    const { wrapper } = await render()

    expect(isXComponent(wrapper.vm)).toEqual(true)
    expect(getXComponentXModuleName(wrapper.vm)).toEqual('vendor')
  })

  it('renders the results in the state', async () => {
    const results = [createVendorResultStub('1'), createVendorResultStub('2')]
    const { wrapper } = await render({ results })
    const items = wrapper.findAll(getDataTestSelector('vendor-results-list-item'))

    expect(items).toHaveLength(2)
    results.forEach((result, index) => expect(items.at(index)?.text()).toEqual(result.id))
  })

  it('does not render any result if there are none', async () => {
    const { wrapper } = await render({ results: [] })

    expect(wrapper.find(getDataTestSelector('items-list')).exists()).toEqual(false)
  })

  it('allows customizing the vendor-result slot', async () => {
    const results = [createVendorResultStub('1')]
    const { wrapper } = await render({
      results,
      template: `
        <VendorResultsList>
          <template #vendor-result="{ item }">
            <p data-test="vendor-result-slot-overridden">Custom vendor result: {{ item.id }}</p>
          </template>
        </VendorResultsList>`,
    })

    expect(wrapper.find(getDataTestSelector('vendor-result-slot-overridden')).text()).toEqual(
      `Custom vendor result: ${results[0].id}`,
    )
  })

  it('allows customizing the default slot', async () => {
    const { wrapper } = await render({
      template: `
        <VendorResultsList>
          <template #default="{ results }">
            <p data-test="default-slot-overridden" />
          </template>
        </VendorResultsList>`,
    })

    expect(wrapper.find(getDataTestSelector('vendor-results-list')).exists()).toEqual(false)
    expect(wrapper.find(getDataTestSelector('default-slot-overridden')).exists()).toEqual(true)
  })

  it('renders all results when there are no injected items', async () => {
    const results = [
      createVendorResultStub('1', { position: 3 }),
      createVendorResultStub('2', { position: 5 }),
    ]
    const { wrapper } = await render({ results })
    const items = wrapper.findAll(getDataTestSelector('vendor-results-list-item'))

    expect(items).toHaveLength(2)
  })

  it('inserts positioned results at their position among injected items', async () => {
    const searchResultsStub = getResultsStub(4)
    const results = [
      createVendorResultStub('1', { position: 2 }),
      createVendorResultStub('2', { position: 4 }),
    ]

    const Provider = defineComponent({
      name: 'Provider',
      setup() {
        const providedStub = computed((): ListItem[] => searchResultsStub)
        provide(LIST_ITEMS_KEY as string, providedStub)
      },
      template: `<div><slot /></div>`,
    })

    const Child = defineComponent({
      name: 'Child',
      setup() {
        const injectedListItems = inject<Ref<ListItem[]>>(LIST_ITEMS_KEY as string)
        const injectedListItemsString = computed(
          () => injectedListItems?.value.map(item => item.id).join(',') ?? '',
        )
        return { injectedListItemsString }
      },
      template: `<p>{{ injectedListItemsString }}</p>`,
    })

    const store = new Store<DeepPartial<RootXStoreState>>({})
    const wrapper = mount(
      {
        template: '<Provider><VendorResultsList><Child /></VendorResultsList></Provider>',
        components: { Provider, Child, VendorResultsList },
      },
      {
        global: {
          plugins: [installNewXPlugin({ store, initialXModules: [searchXModule, vendorXModule] })],
        },
      },
    )

    store.replaceState({
      x: {
        search: {
          ...searchXStoreModule.state(),
          results: searchResultsStub,
          totalResults: 100,
        } as SearchState,
        vendor: { ...vendorXStoreModule.state(), results } as VendorState,
      },
    } as any)
    await nextTick()

    expect(wrapper.text()).toEqual(
      `${searchResultsStub[0].id},${results[0].id},${searchResultsStub[1].id},${results[1].id},${searchResultsStub[2].id},${searchResultsStub[3].id}`,
    )
  })

  it('handles position collision by shifting to the next available slot', async () => {
    const searchResultsStub = getResultsStub(4)
    const results = [
      createVendorResultStub('1', { position: 2 }),
      createVendorResultStub('2', { position: 2 }),
    ]

    const Provider = defineComponent({
      name: 'Provider',
      setup() {
        const providedStub = computed((): ListItem[] => searchResultsStub)
        provide(LIST_ITEMS_KEY as string, providedStub)
      },
      template: `<div><slot /></div>`,
    })

    const Child = defineComponent({
      name: 'Child',
      setup() {
        const injectedListItems = inject<Ref<ListItem[]>>(LIST_ITEMS_KEY as string)
        const injectedListItemsString = computed(
          () => injectedListItems?.value.map(item => item.id).join(',') ?? '',
        )
        return { injectedListItemsString }
      },
      template: `<p>{{ injectedListItemsString }}</p>`,
    })

    const store = new Store<DeepPartial<RootXStoreState>>({})
    const wrapper = mount(
      {
        template: '<Provider><VendorResultsList><Child /></VendorResultsList></Provider>',
        components: { Provider, Child, VendorResultsList },
      },
      {
        global: {
          plugins: [installNewXPlugin({ store, initialXModules: [searchXModule, vendorXModule] })],
        },
      },
    )

    store.replaceState({
      x: {
        search: {
          ...searchXStoreModule.state(),
          results: searchResultsStub,
          totalResults: 100,
        } as SearchState,
        vendor: { ...vendorXStoreModule.state(), results } as VendorState,
      },
    } as any)
    await nextTick()

    expect(wrapper.text()).toEqual(
      `${searchResultsStub[0].id},${results[0].id},${results[1].id},${searchResultsStub[1].id},${searchResultsStub[2].id},${searchResultsStub[3].id}`,
    )
  })

  it('skips positioned results beyond loaded pages when not all pages are loaded', async () => {
    const searchResultsStub = getResultsStub(2)
    const results = [createVendorResultStub('1', { position: 10 })]

    const Provider = defineComponent({
      name: 'Provider',
      setup() {
        const providedStub = computed((): ListItem[] => searchResultsStub)
        provide(LIST_ITEMS_KEY as string, providedStub)
      },
      template: `<div><slot /></div>`,
    })

    const Child = defineComponent({
      name: 'Child',
      setup() {
        const injectedListItems = inject<Ref<ListItem[]>>(LIST_ITEMS_KEY as string)
        const injectedListItemsString = computed(
          () => injectedListItems?.value.map(item => item.id).join(',') ?? '',
        )
        return { injectedListItemsString }
      },
      template: `<p>{{ injectedListItemsString }}</p>`,
    })

    const store = new Store<DeepPartial<RootXStoreState>>({})
    const wrapper = mount(
      {
        template: '<Provider><VendorResultsList><Child /></VendorResultsList></Provider>',
        components: { Provider, Child, VendorResultsList },
      },
      {
        global: {
          plugins: [installNewXPlugin({ store, initialXModules: [searchXModule, vendorXModule] })],
        },
      },
    )

    store.replaceState({
      x: {
        search: { ...searchXStoreModule.state(), results: [], totalResults: 2 } as SearchState,
        vendor: { ...vendorXStoreModule.state(), results } as VendorState,
      },
    } as any)
    await nextTick()

    expect(wrapper.text()).toEqual(searchResultsStub.map(r => r.id).join(','))
  })
})
