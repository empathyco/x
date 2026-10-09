import type { HistoryQuery } from '@empathyco/x-types'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { ariaProvide, installNewXPlugin } from '../../../../__tests__/utils'
import { XPlugin } from '../../../../plugins/index'
import RemoveHistoryQuery from '../remove-history-query.vue'

describe('testing RemoveHistoryQuery component', () => {
  const historyQuery: HistoryQuery = {
    modelName: 'HistoryQuery',
    query: 'Saltiquinos',
    timestamp: 778394,
  }

  it('emits UserPressedRemoveHistoryQuery when it is clicked', async () => {
    const listener = vi.fn()

    const removeHistoryQuery = mount(RemoveHistoryQuery, {
      props: {
        historyQuery,
      },
      global: {
        plugins: [installNewXPlugin()],
        provide: ariaProvide(),
      },
    })
    XPlugin.bus.on('UserPressedRemoveHistoryQuery', true).subscribe(listener)

    await removeHistoryQuery.trigger('click')

    expect(listener).toHaveBeenCalledTimes(1)
    expect(listener).toHaveBeenCalledWith({
      eventPayload: historyQuery,
      metadata: {
        moduleName: 'historyQueries',
        target: removeHistoryQuery.element,
        location: 'none',
        replaceable: true,
      },
    })
  })

  it('renders the default aria-label on the button', () => {
    const removeHistoryQuery = mount(RemoveHistoryQuery, {
      props: {
        historyQuery,
      },
      global: {
        plugins: [installNewXPlugin()],
        provide: ariaProvide(),
      },
    })

    expect(removeHistoryQuery.attributes('aria-label')).toBe('remove')
  })

  it('allows overriding the aria-label of the button', () => {
    const removeHistoryQuery = mount(RemoveHistoryQuery, {
      props: {
        historyQuery,
      },
      global: {
        plugins: [installNewXPlugin()],
        provide: ariaProvide({ removeHistoryQuery: { button: 'Remove this query' } }),
      },
    })

    expect(removeHistoryQuery.attributes('aria-label')).toBe('Remove this query')
  })

  it('resolves the aria-label from the global configuration', () => {
    const removeHistoryQuery = mount(RemoveHistoryQuery, {
      props: {
        historyQuery,
      },
      global: {
        plugins: [installNewXPlugin()],
        provide: ariaProvide({ removeHistoryQuery: { button: 'Eliminar consulta' } }),
      },
    })

    expect(removeHistoryQuery.attributes('aria-label')).toBe('Eliminar consulta')
  })

  it('has a default slot with a default message', () => {
    const removeHistoryQuery = mount(RemoveHistoryQuery, {
      props: {
        historyQuery,
      },
      global: {
        plugins: [installNewXPlugin()],
        provide: ariaProvide(),
      },
    })

    expect(removeHistoryQuery.element.textContent).toEqual('')
  })

  it('has a default slot to customize its contents', () => {
    const slotTemplate = '<span class="x-remove-history-query__text">Remove</span>'
    const removeHistoryQuery = mount(RemoveHistoryQuery, {
      slots: {
        default: {
          template: slotTemplate,
        },
      },
      props: {
        historyQuery,
      },
      global: {
        plugins: [installNewXPlugin()],
        provide: ariaProvide(),
      },
    })

    const renderedSlotHTML = removeHistoryQuery.element.querySelector(
      '.x-remove-history-query__text',
    )

    expect(renderedSlotHTML).toBeDefined()
    expect(renderedSlotHTML.textContent).toEqual('Remove')
  })
})
