import type { AriaLabelsConfig } from '@x/composables/use-aria-labels'
import { mount } from '@vue/test-utils'
import {
  ariaLabels,
  formatAriaLabelTemplate,
  resetAriaLabels,
  useAriaLabels,
} from '@x/composables/use-aria-labels'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { computed, defineComponent, nextTick } from 'vue'

function createAriaLabelProbe() {
  return defineComponent({
    setup: () => {
      const label = computed(() => ariaLabels.value.Facets?.ariaLabel ?? 'Facets')
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

    firstHandle.set({ Facets: { ariaLabel: 'Filtros' } })

    expect(ariaLabels.value).toEqual({ Facets: { ariaLabel: 'Filtros' } })

    secondHandle.set({ Facets: { ariaLabel: 'Filtres' } })

    expect(ariaLabels.value).toEqual({ Facets: { ariaLabel: 'Filtres' } })
  })

  it('replaces the map instead of merging', () => {
    const handle = useAriaLabels()

    handle.set({ Facets: { ariaLabel: 'Filtros' } })
    handle.set({ PageSelector: { prevPage: 'Página anterior', nextPage: 'Página siguiente' } })

    expect(ariaLabels.value).toEqual({
      PageSelector: { prevPage: 'Página anterior', nextPage: 'Página siguiente' },
    })
  })

  it('updates mounted components after .set() without re-mounting them', async () => {
    const wrapper = mount(createAriaLabelProbe())

    expect(wrapper.get('[data-test="aria-label-probe"]').text()).toBe('Facets')

    useAriaLabels().set({ Facets: { ariaLabel: 'Filtros' } })
    await nextTick()

    expect(wrapper.get('[data-test="aria-label-probe"]').text()).toBe('Filtros')
  })

  it('resetAriaLabels() restores the initial state so fresh mounts render defaults', () => {
    useAriaLabels().set({ Facets: { ariaLabel: 'Filtros' } })

    const mountedWhileSet = mount(createAriaLabelProbe())
    expect(mountedWhileSet.get('[data-test="aria-label-probe"]').text()).toBe('Filtros')
    mountedWhileSet.unmount()

    resetAriaLabels()

    const freshMount = mount(createAriaLabelProbe())

    expect(ariaLabels.value).toEqual({})
    expect(freshMount.get('[data-test="aria-label-probe"]').text()).toBe('Facets')

    freshMount.unmount()
  })

  it('silently ignores unknown runtime keys: no throw, no console output, valid keys resolve', () => {
    const warnSpy = vi.spyOn(console, 'warn')
    const errorSpy = vi.spyOn(console, 'error')
    const logSpy = vi.spyOn(console, 'log')

    // Simulates a JavaScript consumer bypassing the TypeScript check.
    expect(() =>
      useAriaLabels().set({
        Facets: { ariaLabel: 'Filtros', bogus: 'x' },
        BogusNamespace: { ariaLabel: 'x' },
      } as AriaLabelsConfig),
    ).not.toThrow()

    expect(warnSpy).not.toHaveBeenCalled()
    expect(errorSpy).not.toHaveBeenCalled()
    expect(logSpy).not.toHaveBeenCalled()
    expect(ariaLabels.value.Facets?.ariaLabel).toBe('Filtros')

    warnSpy.mockRestore()
    errorSpy.mockRestore()
    logSpy.mockRestore()
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
