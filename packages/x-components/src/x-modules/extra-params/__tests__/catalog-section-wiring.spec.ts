import type { NextQueriesRequest, SearchRequest, XComponentsAdapter } from '@empathyco/x-types'
import type { Mock } from 'vitest'
import type { SearchConfig } from '../../search/config.types'
import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import {
  getEmptySearchResponseStub,
  getNextQueriesStub,
  getSearchResponseStub,
  snippetConfigStub,
} from '../../../__stubs__'
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
 * @param options - The rendering options.
 * @param options.defaultCatalogSection - The catalog section to send when none is selected.
 * @param options.catalogSectionParamKey - The key under which the catalog section is sent.
 * @param options.noResultsFallback - The search `noResultsFallback` config.
 * @param options.search - Overrides the search adapter mock.
 * @returns The rendered wrapper and the mocked adapter.
 *
 * @internal
 */
function render({
  defaultCatalogSection = '',
  catalogSectionParamKey,
  noResultsFallback,
  search = getMockedAdapterFunction(getSearchResponseStub()),
}: {
  defaultCatalogSection?: string
  catalogSectionParamKey?: string
  noResultsFallback?: SearchConfig['noResultsFallback']
  search?: Mock
} = {}) {
  const adapter: XComponentsAdapter = {
    ...XComponentsAdapterDummy,
    search,
    nextQueries: getMockedAdapterFunction({ nextQueries: getNextQueriesStub() }),
  }

  const wrapper = mount(
    // The component is registered explicitly: Vue silently drops unresolved components, and the
    // URL params are loaded during the UrlHandler `mounted` hook.
    { components: { UrlHandler }, template: '<UrlHandler />' },
    {
      global: {
        plugins: [
          installNewXPlugin({
            adapter,
            initialXModules: [searchXModule, extraParamsXModule, nextQueriesXModule],
            xModules: {
              search: { config: { defaultCatalogSection, noResultsFallback } },
            },
            __PRIVATE__xModules: catalogSectionParamKey
              ? {
                  extraParams: { storeModule: { state: { catalogSectionParamKey } } },
                }
              : {},
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
  // The URL is read by the UrlHandler when it is mounted, so it is cleaned up before each test to
  // avoid leaking the params set by the previous ones.
  beforeEach(() => {
    window.history.replaceState({}, '', '/')
  })

  it('fetches the search without a catalogSection extra param when a query is accepted', async () => {
    const { adapter } = render()

    await XPlugin.bus.emit('UserAcceptedAQuery', 'lego')
    await settlePipeline()

    const searchRequest: SearchRequest = (adapter.search as Mock).mock.calls[0][0]
    expect(adapter.search).toHaveBeenCalledTimes(1)
    expect(searchRequest.query).toBe('lego')
    expect(searchRequest.extraParams).not.toHaveProperty('catalogSection')
  })

  it('sends the catalogSection loaded from the URL in the first search request', async () => {
    window.history.replaceState({}, '', '/?query=lego&catalogSection=electronics')
    const { adapter } = render({ defaultCatalogSection: 'home' })

    await settlePipeline()

    const searchRequest = lastAdapterRequest<SearchRequest>(adapter.search as Mock)
    expect(searchRequest.query).toBe('lego')
    // The section from the URL wins over the configured default one.
    expect(searchRequest.extraParams?.catalogSection).toBe('electronics')
  })

  it('only refetches the search, without the next queries, with the catalogSection extra param when a catalog section is selected', async () => {
    const { adapter } = render()

    await XPlugin.bus.emit('UserAcceptedAQuery', 'lego')
    await settlePipeline()

    await XPlugin.bus.emit('UserSelectedACatalogSection', 'electronics')
    await settlePipeline()

    expect(adapter.search).toHaveBeenCalledTimes(2)
    const searchRequest = lastAdapterRequest<SearchRequest>(adapter.search as Mock)
    expect(searchRequest.query).toBe('lego')
    expect(searchRequest.extraParams?.catalogSection).toBe('electronics')

    // The catalog section is not broadcasted to the other modules, so they neither refetch
    // nor send the extra param.
    expect(adapter.nextQueries).toHaveBeenCalledTimes(1)
    const nextQueriesRequest = lastAdapterRequest<NextQueriesRequest>(adapter.nextQueries as Mock)
    expect(nextQueriesRequest.query).toBe('lego')
    expect(nextQueriesRequest.extraParams).not.toHaveProperty('catalogSection')
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

  it('sends the default catalog section to the search when no catalog section has been selected', async () => {
    const { adapter } = render({ defaultCatalogSection: 'home' })

    await XPlugin.bus.emit('UserAcceptedAQuery', 'lego')
    await settlePipeline()

    const searchRequest = lastAdapterRequest<SearchRequest>(adapter.search as Mock)
    expect(searchRequest.extraParams?.catalogSection).toBe('home')

    expect(adapter.nextQueries).toHaveBeenCalledTimes(1)
    const nextQueriesRequest = lastAdapterRequest<NextQueriesRequest>(adapter.nextQueries as Mock)
    expect(nextQueriesRequest.extraParams).not.toHaveProperty('catalogSection')
  })

  it('sends the selected catalog section instead of the default one', async () => {
    const { adapter } = render({ defaultCatalogSection: 'home' })

    await XPlugin.bus.emit('UserAcceptedAQuery', 'lego')
    await settlePipeline()

    await XPlugin.bus.emit('UserSelectedACatalogSection', 'electronics')
    await settlePipeline()

    const searchRequest = lastAdapterRequest<SearchRequest>(adapter.search as Mock)
    expect(adapter.search).toHaveBeenCalledTimes(2)
    expect(searchRequest.extraParams?.catalogSection).toBe('electronics')
  })

  it('falls back to the default catalog section when the query is cleared', async () => {
    const { adapter } = render({ defaultCatalogSection: 'home' })

    await XPlugin.bus.emit('UserAcceptedAQuery', 'lego')
    await settlePipeline()

    await XPlugin.bus.emit('UserSelectedACatalogSection', 'electronics')
    await settlePipeline()

    await XPlugin.bus.emit('UserClearedQuery', '')
    await settlePipeline()

    await XPlugin.bus.emit('UserAcceptedAQuery', 'lego')
    await settlePipeline()

    const searchRequest = lastAdapterRequest<SearchRequest>(adapter.search as Mock)
    expect(adapter.search).toHaveBeenCalledTimes(3)
    expect(searchRequest.extraParams?.catalogSection).toBe('home')
  })

  it('sends the selected catalog section using the configured param key', async () => {
    const { adapter } = render({
      defaultCatalogSection: 'home',
      catalogSectionParamKey: 'section',
    })

    await XPlugin.bus.emit('UserAcceptedAQuery', 'lego')
    await settlePipeline()

    await XPlugin.bus.emit('UserSelectedACatalogSection', 'electronics')
    await settlePipeline()

    const searchRequest = lastAdapterRequest<SearchRequest>(adapter.search as Mock)
    expect(searchRequest.extraParams?.section).toBe('electronics')
    // The section is only sent using the configured key.
    expect(searchRequest.extraParams).not.toHaveProperty('catalogSection')
  })

  it('sends the default catalog section using the configured param key', async () => {
    const { adapter } = render({
      defaultCatalogSection: 'home',
      catalogSectionParamKey: 'section',
    })

    await XPlugin.bus.emit('UserAcceptedAQuery', 'lego')
    await settlePipeline()

    const searchRequest = lastAdapterRequest<SearchRequest>(adapter.search as Mock)
    expect(searchRequest.extraParams?.section).toBe('home')
    expect(searchRequest.extraParams).not.toHaveProperty('catalogSection')
  })

  it('reads the catalog section provided by the instance using the configured param key', async () => {
    const { adapter } = render({ catalogSectionParamKey: 'section' })

    await XPlugin.bus.emit('ExtraParamsProvided', { section: 'electronics' })
    await XPlugin.bus.emit('UserAcceptedAQuery', 'lego')
    await settlePipeline()

    const searchRequest = lastAdapterRequest<SearchRequest>(adapter.search as Mock)
    expect(searchRequest.extraParams?.section).toBe('electronics')
    expect(searchRequest.extraParams).not.toHaveProperty('catalogSection')

    // The catalog section provided by the instance is not broadcast to the other modules either.
    expect(adapter.nextQueries).toHaveBeenCalledTimes(1)
    const nextQueriesRequest = lastAdapterRequest<NextQueriesRequest>(adapter.nextQueries as Mock)
    expect(nextQueriesRequest.extraParams).not.toHaveProperty('section')
  })

  describe('noResultsFallback', () => {
    // Responds with results only to the requests that match the predicate.
    const searchWhen = (hasResults: (request: SearchRequest) => boolean): Mock =>
      vi.fn(async (request: SearchRequest) =>
        hasResults(request) ? getSearchResponseStub() : getEmptySearchResponseStub(),
      )

    it('rescues a query without results with only two search requests', async () => {
      const { adapter } = render({
        catalogSectionParamKey: 'section',
        noResultsFallback: { catalogSection: 'section-a' },
        search: searchWhen(request => request.extraParams?.section === 'section-a'),
      })

      const responseChanged = vi.fn()
      XPlugin.bus.on('SearchResponseChanged', false).subscribe(responseChanged)

      await XPlugin.bus.emit('UserAcceptedAQuery', 'query-1')
      await settlePipeline()

      expect(adapter.search).toHaveBeenCalledTimes(2)
      expect(responseChanged).toHaveBeenCalledTimes(1)
      expect(responseChanged).toHaveBeenCalledWith(
        expect.objectContaining({ totalResults: getSearchResponseStub().totalResults }),
      )
      expect(lastAdapterRequest<SearchRequest>(adapter.search as Mock).extraParams?.section).toBe(
        'section-a',
      )
      expect(XPlugin.store.state.x.search.catalogSection).toBe('section-a')
      expect(XPlugin.store.state.x.search.isNoResults).toBe(false)
    })

    it('stores the extra params of the fallback and keeps them on the next query', async () => {
      const { adapter } = render({
        catalogSectionParamKey: 'section',
        noResultsFallback: { catalogSection: 'section-a', extraParams: { market: 'market-b' } },
        search: searchWhen(request => request.extraParams?.market === 'market-b'),
      })

      await XPlugin.bus.emit('UserAcceptedAQuery', 'query-2')
      await settlePipeline()
      expect(adapter.search).toHaveBeenCalledTimes(2)
      expect(XPlugin.store.state.x.extraParams.params.market).toBe('market-b')

      await XPlugin.bus.emit('UserAcceptedAQuery', 'query-3')
      await settlePipeline()
      expect(adapter.search).toHaveBeenCalledTimes(3)
      expect(lastAdapterRequest<SearchRequest>(adapter.search as Mock).extraParams).toMatchObject({
        section: 'section-a',
        market: 'market-b',
      })
    })

    it('changes the section even if the fallback has no results either, without looping', async () => {
      const { adapter } = render({
        catalogSectionParamKey: 'section',
        noResultsFallback: { catalogSection: 'section-a' },
        search: searchWhen(() => false),
      })

      await XPlugin.bus.emit('UserAcceptedAQuery', 'query-4')
      await settlePipeline(12)

      expect(adapter.search).toHaveBeenCalledTimes(2)
      expect(XPlugin.store.state.x.search.catalogSection).toBe('section-a')
      expect(XPlugin.store.state.x.search.isNoResults).toBe(true)
    })

    it('does not loop when the search params and the extra params differ', async () => {
      const { adapter } = render({
        catalogSectionParamKey: 'section',
        noResultsFallback: { extraParams: { market: 'market-b' } },
        search: searchWhen(() => false),
      })
      await XPlugin.bus.emit('UserChangedExtraParams', { market: 'market-b' })
      await settlePipeline()
      vi.mocked(adapter.search).mockClear()

      // A query preview overrides the search params without changing the extra params.
      await XPlugin.bus.emit('UserAcceptedAQueryPreview', {
        query: 'query-5',
        extraParams: { market: 'market-c' },
        results: [],
      } as any)
      await settlePipeline(12)

      expect(adapter.search).toHaveBeenCalledTimes(2)
    })

    it('does not loop when the catalog section is set inside the extra params', async () => {
      const { adapter } = render({
        catalogSectionParamKey: 'section',
        noResultsFallback: { extraParams: { section: 'section-a' } },
        search: searchWhen(() => false),
      })

      await XPlugin.bus.emit('UserAcceptedAQuery', 'query-6')
      await settlePipeline(12)

      expect(adapter.search).toHaveBeenCalledTimes(2)
    })
  })
})
