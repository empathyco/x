import type { DeepPartial } from '@empathyco/x-utils'
import type { RootXStoreState } from '../../../../store/store.types'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, provide, ref } from 'vue'
import { Store } from 'vuex'
import { XComponentsAdapterDummy } from '../../../../__tests__/adapter.dummy'
import { installNewXPlugin } from '../../../../__tests__/utils'
import { LIST_ITEMS_KEY, QUERY_KEY } from '../../../../components/decorators/injection.consts'
import { useOnDisplay } from '../../../../composables/use-on-display'
import { XPlugin } from '../../../../plugins'
import { nextQueriesXModule } from '../../x-module'
import NextQueriesList from '../next-queries-list.vue'
import NextQueries from '../next-queries.vue'

vi.mock('../../../../composables/use-on-display', () => ({
  useOnDisplay: vi.fn(),
  useEmitDisplayEvent: vi.fn(),
}))

function render({ template = '<NextQueries />' } = {}) {
  const store = new Store<DeepPartial<RootXStoreState>>({})
  ;(XComponentsAdapterDummy.nextQueries as any).mockResolvedValue({ nextQueries: [] })

  const isElementVisible = ref(false)
  ;(useOnDisplay as any).mockImplementation(() => ({ isElementVisible, unwatchDisplay: vi.fn() }))

  const showList = ref(true)
  const wrapper = mount(
    {
      template,
      components: { NextQueries, NextQueriesList },
      setup: () => {
        // Search items where the list inserts the next queries groups (or the visibility anchor).
        provide(
          LIST_ITEMS_KEY as string,
          ref(
            Array.from({ length: 4 }, (_, index) => ({ id: `item-${index}`, modelName: 'Item' })),
          ),
        )
        provide(QUERY_KEY as string, ref('milk'))
        return { showList }
      },
    },
    {
      global: { plugins: [installNewXPlugin({ store, initialXModules: [nextQueriesXModule] })] },
      store,
    },
  )

  const requestSpy = vi.fn()
  XPlugin.bus.on('NextQueriesRequestUpdated').subscribe(requestSpy)

  /** Flushes the XBus queued events and the store/Vue updates they trigger. */
  const flush = async () => {
    await nextTick()
    vi.advanceTimersByTime(1)
    await nextTick()
  }

  return {
    wrapper,
    requestSpy,
    getRenderedItems: () =>
      wrapper
        .findAll('.x-items-list__item')
        .map(item =>
          item.find('.x-next-queries-container--placeholder').exists()
            ? 'placeholder'
            : item.text(),
        ),
    setQuery: async (query: string) => {
      store.commit('x/nextQueries/setQuery', query)
      await flush()
    },
    setShowList: async (show: boolean) => {
      showList.value = show
      await flush()
    },
    setVisible: async (visible: boolean) => {
      isElementVisible.value = visible
      await flush()
    },
  }
}

describe('next queries request', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('with only the NextQueries component', () => {
    it('does not emit the request when it changes while hidden or visible', async () => {
      const { setQuery, setVisible, requestSpy } = render()

      await setQuery('milk')
      await setVisible(true)
      await setQuery('chocolate')

      expect(requestSpy).toHaveBeenCalledTimes(1)
      expect(requestSpy).toHaveBeenCalledWith(expect.objectContaining({ query: 'milk' }))
    })

    it('emits the latest request when the component becomes visible again', async () => {
      const { setQuery, setVisible, requestSpy } = render()

      await setQuery('milk')
      await setVisible(true)
      await setVisible(false)
      await setQuery('chocolate')
      await setVisible(true)

      expect(requestSpy).toHaveBeenCalledTimes(2)
      expect(requestSpy).toHaveBeenLastCalledWith(expect.objectContaining({ query: 'chocolate' }))
    })

    it('does not emit the same request again when displayed again', async () => {
      const { setQuery, setVisible, requestSpy } = render()

      await setQuery('milk')
      await setVisible(true)
      await setVisible(false)
      await setVisible(true)

      expect(requestSpy).toHaveBeenCalledTimes(1)
    })
  })

  describe('with the NextQueriesList component mounted', () => {
    const listTemplate = `
      <NextQueriesList v-if="showList" :offset="2">
        <template #next-queries-group="{ item }"><NextQueries :suggestions="item.nextQueries" /></template>
      </NextQueriesList>`

    it('inserts a placeholder group where the first group would be while the request is pending', async () => {
      const { setQuery, getRenderedItems, requestSpy } = render({ template: listTemplate })

      await setQuery('milk')

      expect(requestSpy).not.toHaveBeenCalled()
      expect(getRenderedItems()).toEqual(['item-0', 'item-1', 'placeholder', 'item-2', 'item-3'])
    })

    it('emits the request when the placeholder group is displayed and removes it', async () => {
      const { setQuery, setVisible, getRenderedItems, requestSpy } = render({
        template: listTemplate,
      })

      await setQuery('milk')
      await setVisible(true)

      expect(requestSpy).toHaveBeenCalledTimes(1)
      expect(requestSpy).toHaveBeenCalledWith(expect.objectContaining({ query: 'milk' }))
      expect(getRenderedItems()).not.toContain('placeholder')
    })

    it('does not insert the placeholder group when there is no pending request', async () => {
      const { getRenderedItems, requestSpy } = render({ template: listTemplate })

      expect(requestSpy).not.toHaveBeenCalled()
      expect(getRenderedItems()).toEqual(['item-0', 'item-1', 'item-2', 'item-3'])
    })
  })

  describe('with only the NextQueries component, while the request is pending', () => {
    it('reserves placeholder space', async () => {
      const { wrapper, setQuery } = render()

      await setQuery('milk')

      expect(wrapper.find('.x-next-queries-container--placeholder').exists()).toBe(true)
    })
  })
})
