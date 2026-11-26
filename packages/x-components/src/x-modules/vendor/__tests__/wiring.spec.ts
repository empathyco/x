import type { VendorRelatedPrompt, VendorRelatedPromptsGroupInput } from '../types'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Store } from 'vuex'
import { installNewXPlugin } from '../../../__tests__/utils'
import { XPlugin } from '../../../plugins/x-plugin'
import { vendorXModule } from '../x-module'

/**
 * Installs the vendor module in a new store.
 *
 * @returns The store with the vendor module registered.
 */
function render() {
  const store = new Store<any>({})
  mount(
    {},
    { global: { plugins: [installNewXPlugin({ store, initialXModules: [vendorXModule] })] } },
  )
  return { store }
}

function createGroupInput(
  id: string,
  group?: Partial<VendorRelatedPromptsGroupInput>,
): VendorRelatedPromptsGroupInput {
  return {
    id,
    row: 2,
    relatedPrompts: [{ suggestionText: `Prompt ${id}`, nextQueries: [], type: 'SPONSORED' }],
    ...group,
  }
}

const relatedPrompt: VendorRelatedPrompt = {
  modelName: 'VendorRelatedPrompt',
  suggestionText: 'How much sugar does it have?',
  nextQueries: [],
  type: 'SPONSORED',
  metadata: { productId: '123', campaignId: 'c-1' },
  tagging: {
    mountedUrl: 'https://vendor.test/mounted',
    viewUrl: 'https://vendor.test/view',
    clickUrl: 'https://vendor.test/click',
  },
}

describe('testing vendor module wiring for related prompts', () => {
  const fetchMock = vi.fn(async () => Promise.resolve(new Response()))

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    fetchMock.mockClear()
  })

  it('saves the vendor related prompts groups assigning their modelName', async () => {
    const { store } = render()
    const title = 'Sponsored'

    await XPlugin.bus.emit('VendorRelatedPromptsChanged', [
      createGroupInput('1', { title, metadata: { campaignId: 'c-1' } }),
    ])

    expect(store.state.x.vendor.relatedPromptsGroups).toEqual([
      {
        id: '1',
        row: 2,
        title,
        metadata: { campaignId: 'c-1' },
        modelName: 'VendorRelatedPromptsGroup',
        relatedPrompts: [
          {
            suggestionText: 'Prompt 1',
            nextQueries: [],
            type: 'SPONSORED',
            modelName: 'VendorRelatedPrompt',
          },
        ],
      },
    ])
  })

  it('resets the vendor related prompts groups when the user accepts a new query', async () => {
    const { store } = render()
    await XPlugin.bus.emit('VendorRelatedPromptsChanged', [createGroupInput('1')])

    await XPlugin.bus.emit('UserAcceptedAQuery', 'yogurt')

    expect(store.state.x.vendor.relatedPromptsGroups).toEqual([])
  })

  it('calls the vendor tagging urls when a related prompt is mounted, viewed and clicked', async () => {
    render()

    await XPlugin.bus.emit('VendorRelatedPromptMounted', relatedPrompt)
    await XPlugin.bus.emit('UserViewedAVendorRelatedPrompt', relatedPrompt)
    await XPlugin.bus.emit('UserClickedAVendorRelatedPrompt', relatedPrompt)

    expect(fetchMock).toHaveBeenCalledTimes(3)
    expect(fetchMock).toHaveBeenNthCalledWith(1, relatedPrompt.tagging!.mountedUrl, {
      method: 'GET',
      keepalive: true,
    })
    expect(fetchMock).toHaveBeenNthCalledWith(2, relatedPrompt.tagging!.viewUrl, {
      method: 'GET',
      keepalive: true,
    })
    expect(fetchMock).toHaveBeenNthCalledWith(3, relatedPrompt.tagging!.clickUrl, {
      method: 'GET',
      keepalive: true,
    })
  })

  it('does not call any url when the related prompt has no tagging', async () => {
    render()
    const { tagging: _tagging, ...relatedPromptWithoutTagging } = relatedPrompt

    await XPlugin.bus.emit('VendorRelatedPromptMounted', relatedPromptWithoutTagging)
    await XPlugin.bus.emit('UserClickedAVendorRelatedPrompt', relatedPromptWithoutTagging)

    expect(fetchMock).not.toHaveBeenCalled()
  })
})
