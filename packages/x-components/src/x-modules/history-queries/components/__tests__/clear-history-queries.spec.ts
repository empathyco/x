import type { DeepPartial } from '@empathyco/x-utils'
import type { RootXStoreState } from '../../../../store'
import type { AriaLabels } from '../../../../types'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { Store } from 'vuex'
import { ariaProvide, installNewXPlugin } from '../../../../__tests__/utils'
import { XPlugin } from '../../../../plugins'
import { historyQueriesXModule } from '../../x-module'
import ClearHistoryQueries from '../clear-history-queries.vue'
import { resetXHistoryQueriesStateWith } from './utils'

function render(ariaLabels: AriaLabels = {}) {
  const store = new Store<DeepPartial<RootXStoreState>>({})
  const wrapper = mount(ClearHistoryQueries, {
    global: {
      plugins: [installNewXPlugin({ store, initialXModules: [historyQueriesXModule] })],
      provide: ariaProvide(ariaLabels),
    },
  })

  return {
    store,
    wrapper,
  }
}

describe('testing ClearHistoryQueries component', () => {
  it('is disabled if there are not history queries', async () => {
    const { wrapper, store } = render()

    expect(wrapper.attributes()).toHaveProperty('disabled')

    resetXHistoryQueriesStateWith(store, {
      historyQueries: [
        {
          query: 'I want BBQ',
          modelName: 'HistoryQuery',
          timestamp: 0,
        },
      ],
    })
    await nextTick()

    expect(wrapper.attributes()).not.toHaveProperty('disabled')
  })

  it('emits UserPressedClearHistoryQueries when clicked', async () => {
    const { wrapper, store } = render()
    const listener = vi.fn()
    XPlugin.bus.on('UserPressedClearHistoryQueries', true).subscribe(listener)

    resetXHistoryQueriesStateWith(store, {
      historyQueries: [
        {
          query: 'I want BBQ',
          modelName: 'HistoryQuery',
          timestamp: 0,
        },
      ],
    })

    await nextTick()
    await wrapper.trigger('click')

    expect(listener).toHaveBeenCalledTimes(1)
    expect(listener).toHaveBeenCalledWith({
      eventPayload: undefined,
      metadata: {
        moduleName: 'historyQueries',
        target: wrapper.element,
        location: 'none',
        replaceable: true,
      },
    })
  })

  it('renders the default aria-label on the button', () => {
    const { wrapper } = render()

    expect(wrapper.attributes('aria-label')).toBe('Clear all')
  })

  it('allows overriding the aria-label of the button', () => {
    const { wrapper } = render({ clearHistoryQueries: { button: 'Clear all history queries' } })

    expect(wrapper.attributes('aria-label')).toBe('Clear all history queries')
  })

  it('resolves the aria-label of the button from the global configuration', () => {
    const { wrapper } = render({ clearHistoryQueries: { button: 'Borrar todo' } })

    expect(wrapper.attributes('aria-label')).toBe('Borrar todo')
  })

  it('has an slot rendering a message by default', () => {
    const { wrapper } = render()

    expect(wrapper.element.textContent).toEqual('✕')
  })

  it('has a default slot to customize its contents', () => {
    const store = new Store<DeepPartial<RootXStoreState>>({})

    const wrapper = mount(ClearHistoryQueries, {
      global: {
        plugins: [installNewXPlugin({ store, initialXModules: [historyQueriesXModule] })],
        provide: ariaProvide(),
      },
      slots: {
        default: {
          template: '<span class="x-clear-history-queries__text">Clear</span>',
        },
      },
    })
    const renderedSlot = wrapper.find('.x-clear-history-queries__text')

    expect(renderedSlot).toBeDefined()
    expect(renderedSlot.text()).toEqual('Clear')
  })
})
