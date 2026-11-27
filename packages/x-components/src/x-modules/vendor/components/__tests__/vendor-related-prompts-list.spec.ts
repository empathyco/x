import type { DeepPartial } from '@empathyco/x-utils'
import type { Ref } from 'vue'
import type { RootXStoreState } from '../../../../store'
import type { ListItem } from '../../../../utils/types'
import type { VendorRelatedPromptsGroup } from '../../types'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { computed, defineComponent, inject, nextTick, provide } from 'vue'
import { Store } from 'vuex'
import { installNewXPlugin } from '../../../../__tests__/utils'
import { getXComponentXModuleName, isXComponent, LIST_ITEMS_KEY } from '../../../../components'
import { XPlugin } from '../../../../plugins/x-plugin'
import { searchXStoreModule } from '../../../search/store/module'
import { searchXModule } from '../../../search/x-module'
import { vendorXStoreModule } from '../../store/module'
import { vendorXModule } from '../../x-module'
import VendorRelatedPromptsList from '../vendor-related-prompts-list.vue'

function createGroupStub(id: string, row: number): VendorRelatedPromptsGroup {
  return {
    id,
    row,
    modelName: 'VendorRelatedPromptsGroup',
    relatedPrompts: [
      {
        modelName: 'VendorRelatedPrompt',
        suggestionText: `Prompt ${id}`,
        nextQueries: [],
        type: 'SPONSORED',
      },
    ],
  }
}

function createResultsStub(count: number): ListItem[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `r${index + 1}`,
    modelName: 'Result',
  }))
}

/**
 * Mounts the list with the given items injected by an ancestor, and a `Child` that renders the
 * ids of the list items provided by the list.
 *
 * @param options - The render options.
 * @param options.injectedItems - The items injected by an ancestor, or none.
 * @param options.groups - The vendor related prompts groups of the state.
 * @param options.totalResults - The total results of the search state.
 * @returns The wrapper and a function to emit the rendered columns.
 */
async function render({
  injectedItems,
  groups = [],
  totalResults = 100,
}: {
  injectedItems?: ListItem[]
  groups?: VendorRelatedPromptsGroup[]
  totalResults?: number
}) {
  const Provider = defineComponent({
    name: 'Provider',
    setup() {
      if (injectedItems) {
        provide(
          LIST_ITEMS_KEY as string,
          computed(() => injectedItems),
        )
      }
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
      template: `<Provider><VendorRelatedPromptsList><Child /></VendorRelatedPromptsList></Provider>`,
      components: { Provider, Child, VendorRelatedPromptsList },
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
        results: (injectedItems ?? []).filter(item => item.modelName === 'Result'),
        totalResults,
      },
      vendor: { ...vendorXStoreModule.state(), relatedPromptsGroups: groups },
    },
  } as any)
  await nextTick()

  return {
    wrapper,
    getIds: () => wrapper.find('p').text(),
    setColumns: async (columns: number) => {
      await XPlugin.bus.emit('RenderedColumnsNumberChanged', columns)
      await nextTick()
    },
  }
}

describe('testing VendorRelatedPromptsList component', () => {
  it('is an XComponent which has an XModule', async () => {
    const { wrapper } = await render({})
    const list = wrapper.findComponent(VendorRelatedPromptsList)

    expect(isXComponent(list.vm)).toBeTruthy()
    expect(getXComponentXModuleName(list.vm)).toEqual('vendor')
  })

  it('provides only the groups when there are no injected items', async () => {
    const { getIds } = await render({
      groups: [createGroupStub('g2', 3), createGroupStub('g1', 1)],
    })

    expect(getIds()).toBe('g1,g2')
  })

  it('does not modify the injected items when there are no groups', async () => {
    const { getIds, setColumns } = await render({ injectedItems: createResultsStub(4) })
    await setColumns(2)

    expect(getIds()).toBe('r1,r2,r3,r4')
  })

  it('does not insert the groups until the number of columns is known', async () => {
    const { getIds } = await render({
      injectedItems: createResultsStub(4),
      groups: [createGroupStub('g1', 2)],
    })

    expect(getIds()).toBe('r1,r2,r3,r4')
  })

  it('inserts the groups at the beginning of their rows', async () => {
    const { getIds, setColumns } = await render({
      injectedItems: createResultsStub(8),
      groups: [createGroupStub('g3', 3), createGroupStub('g1', 1)],
    })

    await setColumns(2)
    expect(getIds()).toBe('g1,r1,r2,r3,r4,g3,r5,r6,r7,r8')

    await setColumns(4)
    expect(getIds()).toBe('g1,r1,r2,r3,r4,r5,r6,r7,r8,g3')
  })

  it('renders the groups of the same row in order', async () => {
    const { getIds, setColumns } = await render({
      injectedItems: createResultsStub(4),
      groups: [createGroupStub('g1', 2), createGroupStub('g2', 2)],
    })
    await setColumns(2)

    expect(getIds()).toBe('r1,r2,g1,g2,r3,r4')
  })

  it('counts the full-width items as a row', async () => {
    const { getIds, setColumns } = await render({
      injectedItems: [{ id: 'b1', modelName: 'Banner' }, ...createResultsStub(4)],
      groups: [createGroupStub('g1', 2)],
    })
    await setColumns(4)

    expect(getIds()).toBe('b1,g1,r1,r2,r3,r4')
  })

  it('waits for more pages when the row is beyond the loaded items', async () => {
    const { getIds, setColumns } = await render({
      injectedItems: createResultsStub(4),
      groups: [createGroupStub('g1', 2), createGroupStub('g2', 5)],
      totalResults: 100,
    })
    await setColumns(2)

    expect(getIds()).toBe('r1,r2,g1,r3,r4')
  })

  it('appends the groups at the end when all the pages are loaded', async () => {
    const { getIds, setColumns } = await render({
      injectedItems: createResultsStub(4),
      groups: [createGroupStub('g1', 2), createGroupStub('g2', 5)],
      totalResults: 4,
    })
    await setColumns(2)

    expect(getIds()).toBe('r1,r2,g1,r3,r4,g2')
  })
})
