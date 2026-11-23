import type { DeepPartial } from '@empathyco/x-utils'
import type { Ref } from 'vue'
import type { RootXStoreState } from '../../../../store'
import type { ListItem } from '../../../../utils/types'
import type { SearchState } from '../../../search/store/types'
import type { VendorState } from '../../store/types'
import type { VendorBanner } from '../../types'
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
import VendorBannersList from '../vendor-banners-list.vue'

function createVendorBannerStub(id: string, banner?: Partial<VendorBanner>): VendorBanner {
  return {
    id: `vb-${id}`,
    image: `vb-${id}.jpg`,
    modelName: 'VendorBanner',
    ...banner,
  }
}

async function render({
  template = '<VendorBannersList />',
  banners = [] as VendorBanner[],
  results = getResultsStub(),
  totalResults = 100,
  components = {},
}: {
  template?: string
  banners?: VendorBanner[]
  results?: any
  totalResults?: number
  components?: Record<string, any>
} = {}) {
  const store = new Store<DeepPartial<RootXStoreState>>({})

  const wrapper = mount(
    {
      components: { VendorBannersList, ...components },
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
      search: { ...searchXStoreModule.state(), results, totalResults } as SearchState,
      vendor: { ...vendorXStoreModule.state(), banners } as VendorState,
    },
  } as any)
  await nextTick()

  return {
    wrapper: wrapper.findComponent(VendorBannersList),
    banners,
    results,
  }
}

/**
 * Mounts the list with the given items injected by an ancestor, and a `Child` that renders the
 * ids of the list items provided by the list.
 */
async function renderWithInjectedItems({
  list,
  injectedItems,
  vendorState,
  queryPreviewHash,
}: {
  list: any
  injectedItems: ListItem[]
  vendorState: Partial<VendorState>
  queryPreviewHash?: string
}) {
  const Provider = defineComponent({
    name: 'Provider',
    setup() {
      provide(
        LIST_ITEMS_KEY as string,
        computed((): ListItem[] => injectedItems),
      )
    },
    template: `<div><slot /></div>`,
  })
  const Child = defineComponent({
    name: 'Child',
    setup() {
      const injectedListItems = inject<Ref<ListItem[]>>(LIST_ITEMS_KEY as string)
      return { ids: computed(() => injectedListItems?.value.map(item => item.id).join(',')) }
    },
    template: `<p>{{ ids }}</p>`,
  })
  const store = new Store<DeepPartial<RootXStoreState>>({})
  const wrapper = mount(
    {
      template: `<Provider><List :query-preview-hash="queryPreviewHash"><Child /></List></Provider>`,
      components: { Provider, Child, List: list },
      data: () => ({ queryPreviewHash }),
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
        results: injectedItems,
        totalResults: 100,
      } as SearchState,
      vendor: { ...vendorXStoreModule.state(), ...vendorState } as VendorState,
    },
  } as any)
  await nextTick()
  return wrapper
}

describe('testing VendorBannersList component', () => {
  it('is an XComponent which has an XModule', async () => {
    const { wrapper } = await render()

    expect(isXComponent(wrapper.vm)).toEqual(true)
    expect(getXComponentXModuleName(wrapper.vm)).toEqual('vendor')
  })

  it('renders the banners in the state', async () => {
    const banners = [createVendorBannerStub('1'), createVendorBannerStub('2')]
    const { wrapper } = await render({ banners })
    const items = wrapper.findAll(getDataTestSelector('vendor-banners-list-item'))

    expect(items).toHaveLength(2)
    banners.forEach((banner, index) => expect(items.at(index)?.text()).toEqual(banner.id))
  })

  it('does not render any banner if there are none', async () => {
    const { wrapper } = await render({ banners: [] })

    expect(wrapper.find(getDataTestSelector('items-list')).exists()).toEqual(false)
  })

  it('allows customizing the vendor-banner slot', async () => {
    const banners = [createVendorBannerStub('1')]
    const { wrapper } = await render({
      banners,
      template: `
        <VendorBannersList>
          <template #vendor-banner="{ item }">
            <p data-test="vendor-banner-slot-overridden">Custom vendor banner: {{ item.id }}</p>
          </template>
        </VendorBannersList>`,
    })

    expect(wrapper.find(getDataTestSelector('vendor-banner-slot-overridden')).text()).toEqual(
      `Custom vendor banner: ${banners[0].id}`,
    )
  })

  it('allows customizing the default slot', async () => {
    const { wrapper } = await render({
      template: `
        <VendorBannersList>
          <template #default="{ items }">
            <p data-test="default-slot-overridden" />
          </template>
        </VendorBannersList>`,
    })

    expect(wrapper.find(getDataTestSelector('vendor-banners-list')).exists()).toEqual(false)
    expect(wrapper.find(getDataTestSelector('default-slot-overridden')).exists()).toEqual(true)
  })

  it('renders all banners when there are no injected items', async () => {
    const banners = [createVendorBannerStub('1', { position: 3 }), createVendorBannerStub('2')]
    const { wrapper } = await render({ banners })
    const items = wrapper.findAll(getDataTestSelector('vendor-banners-list-item'))

    expect(items).toHaveLength(2)
  })

  it('places unpositioned banners on top of the injected items', async () => {
    const resultsStub = getResultsStub(3)
    const banners = [createVendorBannerStub('1'), createVendorBannerStub('2')]

    const Provider = defineComponent({
      name: 'Provider',
      setup() {
        const providedStub = computed((): ListItem[] => resultsStub)
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
        template: '<Provider><VendorBannersList><Child /></VendorBannersList></Provider>',
        components: { Provider, Child, VendorBannersList },
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
          results: resultsStub,
          totalResults: 100,
        } as SearchState,
        vendor: { ...vendorXStoreModule.state(), banners } as VendorState,
      },
    } as any)
    await nextTick()

    expect(wrapper.text()).toEqual(
      `${banners[0].id},${banners[1].id},${resultsStub.map(r => r.id).join(',')}`,
    )
  })

  it('inserts positioned banners at their position among injected items', async () => {
    const resultsStub = getResultsStub(4)
    const banners = [
      createVendorBannerStub('1', { position: 2 }),
      createVendorBannerStub('2', { position: 4 }),
    ]

    const Provider = defineComponent({
      name: 'Provider',
      setup() {
        const providedStub = computed((): ListItem[] => resultsStub)
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
        template: '<Provider><VendorBannersList><Child /></VendorBannersList></Provider>',
        components: { Provider, Child, VendorBannersList },
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
          results: resultsStub,
          totalResults: 100,
        } as SearchState,
        vendor: { ...vendorXStoreModule.state(), banners } as VendorState,
      },
    } as any)
    await nextTick()

    expect(wrapper.text()).toEqual(
      `${resultsStub[0].id},${banners[0].id},${resultsStub[1].id},${banners[1].id},${resultsStub[2].id},${resultsStub[3].id}`,
    )
  })

  it('handles a mix of positioned and unpositioned banners', async () => {
    const resultsStub = getResultsStub(4)
    const banners = [
      createVendorBannerStub('1'),
      createVendorBannerStub('2', { position: 3 }),
      createVendorBannerStub('3'),
    ]

    const Provider = defineComponent({
      name: 'Provider',
      setup() {
        const providedStub = computed((): ListItem[] => resultsStub)
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
        template: '<Provider><VendorBannersList><Child /></VendorBannersList></Provider>',
        components: { Provider, Child, VendorBannersList },
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
          results: resultsStub,
          totalResults: 100,
        } as SearchState,
        vendor: { ...vendorXStoreModule.state(), banners } as VendorState,
      },
    } as any)
    await nextTick()

    expect(wrapper.text()).toEqual(
      `${banners[0].id},${banners[2].id},${resultsStub[0].id},${resultsStub[1].id},${banners[1].id},${resultsStub[2].id},${resultsStub[3].id}`,
    )
  })

  it('skips positioned banners beyond loaded pages when not all pages are loaded', async () => {
    const resultsStub = getResultsStub(2)
    const banners = [createVendorBannerStub('1', { position: 10 })]

    const Provider = defineComponent({
      name: 'Provider',
      setup() {
        const providedStub = computed((): ListItem[] => resultsStub)
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
        template: '<Provider><VendorBannersList><Child /></VendorBannersList></Provider>',
        components: { Provider, Child, VendorBannersList },
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
        vendor: { ...vendorXStoreModule.state(), banners } as VendorState,
      },
    } as any)
    await nextTick()

    expect(wrapper.text()).toEqual(resultsStub.map(r => r.id).join(','))
  })

  it('renders the vendor banners of the query preview when a query preview hash is provided', async () => {
    const queryPreviewHash = 'preview-hash'
    const queryPreviewVendorBanners = [
      createVendorBannerStub('preview-1'),
      createVendorBannerStub('preview-2'),
    ]
    const globalVendorBanners = [createVendorBannerStub('global-1')]

    const store = new Store<DeepPartial<RootXStoreState>>({})
    const wrapper = mount(
      {
        components: { VendorBannersList },
        template: '<VendorBannersList :query-preview-hash="queryPreviewHash" />',
        data() {
          return { queryPreviewHash }
        },
      },
      {
        global: {
          plugins: [installNewXPlugin({ store, initialXModules: [searchXModule, vendorXModule] })],
        },
      },
    )

    store.replaceState({
      x: {
        search: { ...searchXStoreModule.state(), results: [], totalResults: 0 } as SearchState,
        vendor: {
          ...vendorXStoreModule.state(),
          banners: globalVendorBanners,
          queryPreviews: {
            [queryPreviewHash]: { results: [], banners: queryPreviewVendorBanners },
          },
        } as VendorState,
      },
    } as any)
    await nextTick()

    const items = wrapper
      .findComponent(VendorBannersList)
      .findAll(getDataTestSelector('vendor-banners-list-item'))

    expect(items).toHaveLength(2)
    expect(items.map(item => item.text())).toEqual(queryPreviewVendorBanners.map(b => b.id))
  })

  it('removes the injected banners that are also vendor banners', async () => {
    const searchResultsStub = getResultsStub(2)
    const indexedBanner = { id: 'banner-1', modelName: 'Banner', image: 'b.jpg' } as ListItem
    const banners = [createVendorBannerStub('1', { id: indexedBanner.id, position: 2 })]

    const wrapper = await renderWithInjectedItems({
      list: VendorBannersList,
      injectedItems: [searchResultsStub[0], indexedBanner, searchResultsStub[1]],
      vendorState: { banners },
    })

    expect(wrapper.text()).toEqual(
      [searchResultsStub[0].id, banners[0].id, searchResultsStub[1].id].join(','),
    )
  })

  it('removes the query preview banners that are also vendor banners of the query preview', async () => {
    const queryPreviewHash = 'preview-hash'
    const previewResultsStub = getResultsStub(2)
    const indexedBanner = { id: 'banner-1', modelName: 'Banner', image: 'b.jpg' } as ListItem
    const banners = [createVendorBannerStub('1', { id: indexedBanner.id, position: 1 })]

    const wrapper = await renderWithInjectedItems({
      list: VendorBannersList,
      injectedItems: [indexedBanner, ...previewResultsStub],
      vendorState: { queryPreviews: { [queryPreviewHash]: { results: [], banners } } },
      queryPreviewHash,
    })

    expect(wrapper.text()).toEqual(
      [banners[0].id, previewResultsStub[0].id, previewResultsStub[1].id].join(','),
    )
  })
})
