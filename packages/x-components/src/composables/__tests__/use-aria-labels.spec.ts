import { mount } from '@vue/test-utils'
import {
  ariaLabels,
  DEFAULT_ARIA_LABELS,
  formatAriaLabelTemplate,
  resetAriaLabels,
  useAriaLabels,
} from '@x/composables/use-aria-labels'
import { beforeEach, describe, expect, it } from 'vitest'
import { computed, defineComponent, nextTick } from 'vue'

function createAriaLabelProbe() {
  return defineComponent({
    setup: () => {
      const label = computed(() => ariaLabels.value.Facets?.root ?? 'Facets')
      return { label }
    },
    template: `<span data-test="aria-label-probe">{{ label }}</span>`,
  })
}

describe('testing useAriaLabels composable', () => {
  beforeEach(() => {
    resetAriaLabels()
  })

  it('shares the same state across all handles', () => {
    const firstHandle = useAriaLabels()
    const secondHandle = useAriaLabels()

    firstHandle.set({ Facets: { root: 'Filtros' } })

    expect(ariaLabels.value).toEqual({
      ...DEFAULT_ARIA_LABELS,
      Facets: { ...DEFAULT_ARIA_LABELS.Facets, root: 'Filtros' },
    })

    secondHandle.set({ Facets: { root: 'Filtres' } })

    expect(ariaLabels.value).toEqual({
      ...DEFAULT_ARIA_LABELS,
      Facets: { ...DEFAULT_ARIA_LABELS.Facets, root: 'Filtres' },
    })
  })

  it('merges onto defaults, keeping sibling keys', () => {
    const handle = useAriaLabels()

    handle.set({ PageSelector: { pagination: 'Paginación' } })

    expect(ariaLabels.value.PageSelector).toEqual({
      pagination: 'Paginación',
      prevPage: 'Previous page',
      nextPage: 'Next page',
      numberPage: 'Page {page}',
    })
  })

  it('each .set() is an independent declaration (never accumulates)', () => {
    const handle = useAriaLabels()

    handle.set({ PageSelector: { pagination: 'A' } })
    handle.set({ Facets: { root: 'B' } })

    expect(ariaLabels.value.PageSelector!.pagination).toBe('Pagination')
    expect(ariaLabels.value.Facets!.root).toBe('B')
  })

  it('updates mounted components after .set() without re-mounting them', async () => {
    const wrapper = mount(createAriaLabelProbe())

    expect(wrapper.get('[data-test="aria-label-probe"]').text()).toBe('Facets')

    useAriaLabels().set({ Facets: { root: 'Filtros' } })
    await nextTick()

    expect(wrapper.get('[data-test="aria-label-probe"]').text()).toBe('Filtros')
  })

  it('resetAriaLabels() restores the initial state so fresh mounts render defaults', () => {
    useAriaLabels().set({ Facets: { root: 'Filtros' } })

    const mountedWhileSet = mount(createAriaLabelProbe())
    expect(mountedWhileSet.get('[data-test="aria-label-probe"]').text()).toBe('Filtros')
    mountedWhileSet.unmount()

    resetAriaLabels()

    const freshMount = mount(createAriaLabelProbe())

    expect(ariaLabels.value).toEqual(DEFAULT_ARIA_LABELS)
    expect(ariaLabels.value).not.toBe(DEFAULT_ARIA_LABELS)
    expect(ariaLabels.value.Facets).not.toBe(DEFAULT_ARIA_LABELS.Facets)
    expect(freshMount.get('[data-test="aria-label-probe"]').text()).toBe('Facets')

    freshMount.unmount()
  })

  describe('formatAriaLabelTemplate', () => {
    it('substitutes {page} and {column} tokens', () => {
      expect(formatAriaLabelTemplate('Page {page}', { page: '2' })).toBe('Page 2')
      expect(formatAriaLabelTemplate('{column} columns', { column: '4' })).toBe('4 columns')
      expect(formatAriaLabelTemplate('Page {page} of {total}', { page: '2', total: '5' })).toBe(
        'Page 2 of 5',
      )
    })

    it('converts number values to strings', () => {
      expect(formatAriaLabelTemplate('Página {page}', { page: 3 })).toBe('Página 3')
      expect(formatAriaLabelTemplate('{column} columns', { column: 6 })).toBe('6 columns')
    })

    it('leaves tokens without a value literal', () => {
      expect(formatAriaLabelTemplate('Page {page} of {total}', { page: '3' })).toBe(
        'Page 3 of {total}',
      )
      expect(formatAriaLabelTemplate('No tokens here', { page: '1' })).toBe('No tokens here')
    })

    it('returns an empty string for an empty template', () => {
      expect(formatAriaLabelTemplate('', { page: '1' })).toBe('')
    })
  })
})
