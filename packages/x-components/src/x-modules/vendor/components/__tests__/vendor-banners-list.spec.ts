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
})
