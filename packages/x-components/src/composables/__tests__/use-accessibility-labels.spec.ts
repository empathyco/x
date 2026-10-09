import type { AriaLabels } from '../../types'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, nextTick, reactive } from 'vue'
import { ACCESSIBILITY_KEY } from '../../types'
import { useAccessibilityLabels } from '../use-accessibility-labels'

function render(provide?: AriaLabels) {
  const component = defineComponent({
    setup: () => {
      const pageSelector = useAccessibilityLabels('pageSelector')
      return { pageSelector }
    },
    template: '<div/>',
  })

  const wrapper = mount(component, {
    global: provide ? { provide: { [ACCESSIBILITY_KEY]: provide } } : undefined,
  })
  return { wrapper, pageSelector: (wrapper as any).vm.pageSelector }
}

describe('testing useAccessibilityLabels composable', () => {
  it('resolves the library defaults when nothing is provided', () => {
    const { pageSelector } = render()
    expect(pageSelector.pagination).toEqual('Pagination')
    expect(pageSelector.prevPage).toEqual('Previous page')
    expect(pageSelector.nextPage).toEqual('Next page')
    expect(pageSelector.numberPage(3)).toEqual('Page 3')
  })

  it('merges a partial consumer override on top of the defaults', () => {
    const { pageSelector } = render({ pageSelector: { pagination: 'Paginación' } })
    expect(pageSelector.pagination).toEqual('Paginación')
    // entries not provided by the consumer keep the default value
    expect(pageSelector.prevPage).toEqual('Previous page')
    expect(pageSelector.nextPage).toEqual('Next page')
  })

  it('supports function entries in the consumer override', () => {
    const { pageSelector } = render({ pageSelector: { numberPage: page => `Página ${page}` } })
    expect(pageSelector.numberPage(2)).toEqual('Página 2')
  })

  it('is reactive when the consumer provides a reactive object', async () => {
    const provided = reactive({ pageSelector: { pagination: 'Pagination' } })
    const { wrapper } = render(provided)
    expect((wrapper as any).vm.pageSelector.pagination).toEqual('Pagination')

    provided.pageSelector.pagination = 'Paginación'
    await nextTick()

    expect((wrapper as any).vm.pageSelector.pagination).toEqual('Paginación')
  })
})
