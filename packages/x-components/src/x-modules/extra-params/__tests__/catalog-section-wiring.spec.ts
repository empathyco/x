import type { NextQueriesRequest, SearchRequest, XComponentsAdapter } from '@empathyco/x-types'
import type { Mock } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { getNextQueriesStub, getSearchResponseStub, snippetConfigStub } from '../../../__stubs__'
import { XComponentsAdapterDummy } from '../../../__tests__/adapter.dummy'
import { getMockedAdapterFunction, installNewXPlugin } from '../../../__tests__/utils'
import { XPlugin } from '../../../plugins'
import { nextQueriesXModule } from '../../next-queries/x-module'
import { searchXModule } from '../../search/x-module'
import UrlHandler from '../../url/components/url-handler.vue'
import { extraParamsXModule } from '../x-module'

// Mock the window.performance.getEntriesByType function used to get the location. The location is
// tested in an E2E test as navigation between different pages is needed.
window.performance.getEntriesByType = vi.fn().mockReturnValue([])

/**
 * Flushes Vue ticks and pending promises (including the adapter mocks' timers) so the whole
 * store watchers -> bus events -> fetch pipeline settles.
 *
 * @param times - Number of tick/promise flush rounds to run.
 *
 * @internal
 */
async function settlePipeline(times = 6): Promise<void> {
  for (let i = 0; i < times; i++) {
    await nextTick()
    await flushPromises()
  }
}

/**
 * Retrieves the request of the last call of an adapter method mock.
 *
 * @typeParam Request - The type of the request to retrieve.
 * @param adapterMethod - The mocked adapter method.
 * @returns The request of the last call.
 *
 * @internal
 */
function lastAdapterRequest<Request>(adapterMethod: Mock): Request {
  const calls = adapterMethod.mock.calls
  return calls[calls.length - 1][0] as Request
}

/**
 * Renders the {@link UrlHandler} component with the X plugin installed, exposing an adapter in
 * which the `search` and `nextQueries` methods are mocked to resolve with valid stubs.
 *
 * @returns The rendered wrapper and the mocked adapter.
 *
 * @internal
 */
function render() {
  const adapter: XComponentsAdapter = {
    ...XComponentsAdapterDummy,
    search: getMockedAdapterFunction(getSearchResponseStub()),
    nextQueries: getMockedAdapterFunction({ nextQueries: getNextQueriesStub() }),
  }

  const wrapper = mount(
    { template: '<UrlHandler />' },
    {
      global: {
        plugins: [
          installNewXPlugin({
            adapter,
            initialXModules: [searchXModule, extraParamsXModule, nextQueriesXModule],
          }),
        ],
        provide: {
          snippetConfig: snippetConfigStub,
        },
      },
    },
  )

  return { adapter, wrapper }
}

describe('testing the catalog section extra param wiring', () => {
  it('fetches the search without a catalogSection extra param when a query is accepted', async () => {
    const { adapter } = render()

    await XPlugin.bus.emit('UserAcceptedAQuery', 'lego')
    await settlePipeline()

    const searchRequest: SearchRequest = (adapter.search as Mock).mock.calls[0][0]
    expect(adapter.search).toHaveBeenCalledTimes(1)
    expect(searchRequest.query).toBe('lego')
    expect(searchRequest.extraParams).not.toHaveProperty('catalogSection')
  })

  it('refetches the search and the next queries with the catalogSection extra param when a catalog section is selected', async () => {
    const { adapter } = render()

    await XPlugin.bus.emit('UserAcceptedAQuery', 'lego')
    await settlePipeline()

    await XPlugin.bus.emit('UserSelectedACatalogSection', 'electronics')
    await settlePipeline()

    expect(adapter.search).toHaveBeenCalledTimes(2)
    const searchRequest = lastAdapterRequest<SearchRequest>(adapter.search as Mock)
    expect(searchRequest.query).toBe('lego')
    expect(searchRequest.extraParams?.catalogSection).toBe('electronics')

    expect(adapter.nextQueries).toHaveBeenCalledTimes(2)
    const nextQueriesRequest = lastAdapterRequest<NextQueriesRequest>(adapter.nextQueries as Mock)
    expect(nextQueriesRequest.query).toBe('lego')
    expect(nextQueriesRequest.extraParams?.catalogSection).toBe('electronics')
  })

  it('resets the catalogSection extra param when the query is cleared', async () => {
    const { adapter } = render()

    await XPlugin.bus.emit('UserAcceptedAQuery', 'lego')
    await settlePipeline()

    await XPlugin.bus.emit('UserSelectedACatalogSection', 'electronics')
    await settlePipeline()

    await XPlugin.bus.emit('UserClearedQuery', '')
    await settlePipeline()

    // Clearing the query stops the search request, so no new search fetch is triggered.
    expect(adapter.search).toHaveBeenCalledTimes(2)

    await XPlugin.bus.emit('UserAcceptedAQuery', 'lego')
    await settlePipeline()

    const searchRequest = lastAdapterRequest<SearchRequest>(adapter.search as Mock)
    expect(adapter.search).toHaveBeenCalledTimes(3)
    expect(searchRequest.query).toBe('lego')
    expect(searchRequest.extraParams?.catalogSection).toBe('')
  })
})
