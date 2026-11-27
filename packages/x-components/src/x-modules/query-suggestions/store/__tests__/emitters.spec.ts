import type { QuerySuggestionsRequest } from '@empathyco/x-types'
import type { RootXStoreState } from '../../../../store/store.types'
import type { WireMetadata } from '../../../../wiring'
import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { Store } from 'vuex'
import { getQuerySuggestionsStub } from '../../../../__stubs__/query-suggestions-stubs.factory'
import { getMockedAdapter, installNewXPlugin } from '../../../../__tests__/utils'
import { XPlugin } from '../../../../plugins/x-plugin'
import { querySuggestionsXModule } from '../../x-module'

/**
 * Flushes Vue ticks and pending promises so the store watchers, bus events and fetch actions
 * settle.
 */
async function settle() {
  for (let i = 0; i < 4; i++) {
    await nextTick()
    await flushPromises()
  }
}

/**
 * Installs the query suggestions module and subscribes a listener to the
 * `QuerySuggestionsRequestUpdated` event.
 *
 * @param options - The rendering options.
 * @param options.requestOnlyWhenVisible - The value of the module config flag.
 * @returns The listener, the store and some helpers to change the module state.
 */
function render({ requestOnlyWhenVisible = true } = {}) {
  const store = new Store<RootXStoreState>({})
  const adapter = getMockedAdapter({
    querySuggestions: { suggestions: getQuerySuggestionsStub('milk') },
  })
  mount(
    {},
    {
      global: {
        plugins: [
          installNewXPlugin({
            store,
            adapter,
            initialXModules: [querySuggestionsXModule],
            xModules: {
              querySuggestions: { config: { requestOnlyWhenVisible } },
            },
          }),
        ],
      },
    },
  )

  const listener = vi.fn()
  XPlugin.bus.on('QuerySuggestionsRequestUpdated', true).subscribe(listener)

  return {
    listener,
    store,
    adapter,
    getRequests: () =>
      listener.mock.calls.map(
        ([{ eventPayload }]) => eventPayload as QuerySuggestionsRequest | null,
      ),
    async setQuery(query: string) {
      store.commit('x/querySuggestions/setQuery', query)
      await settle()
    },
    async setVisible(isVisible: boolean) {
      await XPlugin.bus.emit('QuerySuggestionsVisibilityChanged', isVisible)
      await settle()
    },
  }
}

describe('testing query suggestions module emitters', () => {
  describe('when `requestOnlyWhenVisible` is disabled', () => {
    it('emits `QuerySuggestionsRequestUpdated` whenever the request changes', async () => {
      const { listener, setQuery, getRequests } = render({ requestOnlyWhenVisible: false })

      await setQuery('milk')

      expect(listener).toHaveBeenCalledTimes(1)
      expect(listener).toHaveBeenCalledWith({
        eventPayload: expect.objectContaining({ query: 'milk' }),
        metadata: expect.objectContaining<Partial<WireMetadata>>({
          moduleName: 'querySuggestions',
        }),
      })

      await setQuery('')
      expect(getRequests()).toEqual([expect.objectContaining({ query: 'milk' }), null])
    })
  })

  describe('when `requestOnlyWhenVisible` is enabled', () => {
    it('does not emit while the component is not visible', async () => {
      const { listener, setQuery, adapter } = render()

      await setQuery('milk')

      expect(listener).not.toHaveBeenCalled()
      expect(adapter.querySuggestions).not.toHaveBeenCalled()
    })

    it('emits the request once the component becomes visible', async () => {
      const { setQuery, setVisible, getRequests, adapter, store } = render()

      await setQuery('milk')
      await setVisible(true)

      expect(getRequests()).toEqual([expect.objectContaining({ query: 'milk' })])
      expect(adapter.querySuggestions).toHaveBeenCalledTimes(1)
      expect(store.state.x.querySuggestions.lastRequest).toEqual(
        expect.objectContaining({ query: 'milk' }),
      )
    })

    it('does not emit when the component is hidden, keeping the suggestions', async () => {
      const { setQuery, setVisible, getRequests, store } = render()

      await setVisible(true)
      await setQuery('milk')
      const suggestions = getQuerySuggestionsStub('milk')
      store.commit('x/querySuggestions/setSuggestions', suggestions)
      await setVisible(false)

      expect(getRequests()).toEqual([expect.objectContaining({ query: 'milk' })])
      expect(store.state.x.querySuggestions.suggestions).toEqual(suggestions)
    })

    it('does not emit the same request again when it becomes visible again', async () => {
      const { setQuery, setVisible, getRequests, adapter } = render()

      await setVisible(true)
      await setQuery('milk')
      await setVisible(false)
      await setVisible(true)

      expect(getRequests()).toEqual([expect.objectContaining({ query: 'milk' })])
      expect(adapter.querySuggestions).toHaveBeenCalledTimes(1)
    })

    it('emits the new request when the query changed while it was hidden', async () => {
      const { setQuery, setVisible, getRequests } = render()

      await setVisible(true)
      await setQuery('milk')
      await setVisible(false)
      await setQuery('chocolate')
      await setVisible(true)

      expect(getRequests()).toEqual([
        expect.objectContaining({ query: 'milk' }),
        expect.objectContaining({ query: 'chocolate' }),
      ])
    })

    it('does not emit when the params change to a new object with the same content', async () => {
      const { setQuery, setVisible, getRequests, store } = render()

      store.commit('x/querySuggestions/setParams', { lang: 'en' })
      await setVisible(true)
      await setQuery('milk')
      store.commit('x/querySuggestions/setParams', { lang: 'en' })
      await settle()

      expect(getRequests()).toEqual([expect.objectContaining({ query: 'milk' })])
    })

    it('emits `null` when the query is cleared while it is visible', async () => {
      const { setQuery, setVisible, getRequests, store } = render()

      await setVisible(true)
      await setQuery('milk')
      await setQuery('')

      expect(getRequests()).toEqual([expect.objectContaining({ query: 'milk' }), null])
      expect(store.state.x.querySuggestions.suggestions).toEqual([])
    })
  })
})

describe('testing query suggestions module wiring', () => {
  it('sets the visibility when `QuerySuggestionsVisibilityChanged` is emitted', async () => {
    const { setVisible, store } = render()

    await setVisible(true)
    expect(store.state.x.querySuggestions.isVisible).toBe(true)

    await setVisible(false)
    expect(store.state.x.querySuggestions.isVisible).toBe(false)
  })

  it('clears the suggestions when `UserClearedQuery` is emitted', async () => {
    const { setQuery, store } = render()

    await setQuery('milk')
    store.commit('x/querySuggestions/setSuggestions', getQuerySuggestionsStub('milk'))

    await XPlugin.bus.emit('UserClearedQuery', '')
    await settle()

    expect(store.state.x.querySuggestions.suggestions).toEqual([])
  })
})
