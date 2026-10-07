import type { Result } from '@empathyco/x-types'
import type { VueWrapper } from '@vue/test-utils'
import type { AriaLabels } from '../../types'
import { mount } from '@vue/test-utils'
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, reactive } from 'vue'
import { getResultsStub } from '../../__stubs__/index'
import { getDataTestSelector, installNewXPlugin } from '../../__tests__/utils'
import { XPlugin } from '../../plugins/index'
import { mergeAccesibilityLabels } from '../../utils'
import PageSelector from '../page-selector.vue'

interface PageItem {
  value: number | string
  isSelected: boolean
}

/**
 * Builds the `accesibility` injection with the given overrides merged onto the default labels.
 */
function ariaProvide(overrides: AriaLabels = {}): { accesibility: AriaLabels } {
  return { accesibility: reactive(mergeAccesibilityLabels(overrides)) }
}

function renderPageSelector({
  query = 'dress',
  results = getResultsStub(240),
  totalResults = 240,
  currentPage = 1,
  slots,
  ariaLabels,
}: RenderPageSelectorOptions = {}): RenderPageSelectorAPI {
  const mergedAriaLabels = ariaProvide(ariaLabels).accesibility
  const wrapper = mount(PageSelector, {
    props: {
      totalPages: Math.round(totalResults / 24),
      currentPage,
      range: 2,
      scrollTarget: 'dummy-target',
    },
    global: { plugins: [installNewXPlugin()], provide: { accesibility: mergedAriaLabels } },
    slots,
    data() {
      return {
        query,
        results,
        totalResults,
        currentPage,
      }
    },
  })

  return {
    wrapper,
    emitSpy: vi.spyOn(XPlugin.bus, 'emit'),
    mergedAriaLabels,
  }
}

describe('testing PageSelector component', () => {
  beforeAll(() => {
    vi.useFakeTimers()
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders a page selector component with default slots', () => {
    const { wrapper } = renderPageSelector()
    const visiblePages = (wrapper.vm as any).visiblePages as PageItem[]

    expect(wrapper.find(getDataTestSelector('previous-page-button')).exists()).toBe(true)
    expect(wrapper.find(getDataTestSelector('previous-page-button')).text().trim()).toBe('Prev')
    expect(wrapper.find(getDataTestSelector('next-page-button')).exists()).toBe(true)
    expect(wrapper.find(getDataTestSelector('next-page-button')).text().trim()).toBe('Next')
    expect(visiblePages).toBeDefined()

    // Check that each visible page button exists and displays the correct text
    visiblePages.forEach(page => {
      const pageItem = page.value
      const pageSelector = getDataTestSelector(`page-button-${pageItem}`)
      const pageButton = wrapper.find(pageSelector)

      expect(pageButton.exists()).toBe(true)
      expect(pageButton.text().trim()).toBe(pageItem.toString())
    })
  })

  it('renders the default aria-labels on the pagination nav and the prev/next buttons', () => {
    const { wrapper } = renderPageSelector()

    expect(wrapper.find('.x-page-selector').attributes('aria-label')).toBe('Pagination')
    expect(wrapper.find(getDataTestSelector('previous-page-button')).attributes('aria-label')).toBe(
      'Previous page',
    )
    expect(wrapper.find(getDataTestSelector('next-page-button')).attributes('aria-label')).toBe(
      'Next page',
    )
  })

  it('allows overriding the aria-labels through the global configuration', () => {
    const { wrapper } = renderPageSelector({
      ariaLabels: {
        PageSelector: {
          pagination: 'Page navigation',
          prevPage: 'Go to previous page',
          nextPage: 'Go to next page',
        },
      },
    })

    expect(wrapper.find('.x-page-selector').attributes('aria-label')).toBe('Page navigation')
    expect(wrapper.find(getDataTestSelector('previous-page-button')).attributes('aria-label')).toBe(
      'Go to previous page',
    )
    expect(wrapper.find(getDataTestSelector('next-page-button')).attributes('aria-label')).toBe(
      'Go to next page',
    )
  })

  it('renders the default aria-label for the page number buttons', () => {
    const { wrapper } = renderPageSelector()

    expect(wrapper.find(getDataTestSelector('page-button-1')).attributes('aria-label')).toBe(
      'Page 1',
    )
    expect(wrapper.find(getDataTestSelector('page-button-2')).attributes('aria-label')).toBe(
      'Page 2',
    )
    expect(wrapper.find(getDataTestSelector('page-button-3')).attributes('aria-label')).toBe(
      'Page 3',
    )
  })

  it('resolves the aria labels from the global configuration', () => {
    const { wrapper } = renderPageSelector({
      ariaLabels: {
        PageSelector: {
          pagination: 'Paginación',
          prevPage: 'Página anterior',
          nextPage: 'Página siguiente',
        },
      },
    })

    expect(wrapper.find('.x-page-selector').attributes('aria-label')).toBe('Paginación')
    expect(wrapper.find(getDataTestSelector('previous-page-button')).attributes('aria-label')).toBe(
      'Página anterior',
    )
    expect(wrapper.find(getDataTestSelector('next-page-button')).attributes('aria-label')).toBe(
      'Página siguiente',
    )
  })

  it('applies the global numberPage function per page and updates it at runtime without re-mount', async () => {
    const { wrapper, mergedAriaLabels } = renderPageSelector()

    expect(wrapper.find(getDataTestSelector('page-button-1')).attributes('aria-label')).toBe(
      'Page 1',
    )

    mergedAriaLabels.PageSelector!.numberPage = (page: number | string) => `Página ${page}`
    await nextTick()

    expect(wrapper.find(getDataTestSelector('page-button-1')).attributes('aria-label')).toBe(
      'Página 1',
    )
    expect(wrapper.find(getDataTestSelector('page-button-2')).attributes('aria-label')).toBe(
      'Página 2',
    )
    expect(wrapper.find(getDataTestSelector('page-button-3')).attributes('aria-label')).toBe(
      'Página 3',
    )
  })

  it('allows customizing its slots', () => {
    const { wrapper } = renderPageSelector({
      slots: {
        'previous-page-button': '<span><</span>',
        'page-button-1': '<h2>1</h2>',
        'next-page-button': '<span>></span>',
      },
    })

    expect(wrapper.find(getDataTestSelector('previous-page-button')).exists()).toBe(true)
    expect(wrapper.find(getDataTestSelector('previous-page-button')).text().trim()).toBe('<')
    expect(wrapper.find(getDataTestSelector('page-button-1')).exists()).toBe(true)
    expect(wrapper.find(getDataTestSelector('page-button-1')).text().trim()).toBe('1')
    expect(wrapper.find(getDataTestSelector('next-page-button')).exists()).toBe(true)
    expect(wrapper.find(getDataTestSelector('next-page-button')).text().trim()).toBe('>')
  })

  it('emits UserSelectedAPage and UserClickedScrollToTop events when enabled buttons are clicked', async () => {
    const { wrapper, emitSpy } = renderPageSelector()
    const nextButton = wrapper.find(getDataTestSelector('next-page-button'))

    await nextButton.trigger('click')

    expect(emitSpy).toHaveBeenCalledTimes(2)
    expect(emitSpy).toHaveBeenCalledWith('UserSelectedAPage', 2, expect.any(Object))
    expect(emitSpy).toHaveBeenCalledWith(
      'UserClickedScrollToTop',
      'dummy-target',
      expect.any(Object),
    )
  })

  it('sets the x-page-selector__page--current class if the button is the currentPage', () => {
    const { wrapper } = renderPageSelector({ currentPage: 1 })

    const currentPageButton = wrapper.find(getDataTestSelector('page-button-1'))
    expect(currentPageButton.classes()).toContain('x-page-selector__page--current')
  })

  it('disables the previous-page-button if we are on the first page', () => {
    const { wrapper } = renderPageSelector()

    const prevButton = wrapper.find(getDataTestSelector('previous-page-button'))
    expect(prevButton.attributes('disabled')).toBe('')
  })

  it('disables the next-page-button if we are on the last page', () => {
    const totalPages = Math.round(240 / 24)
    const { wrapper } = renderPageSelector({ currentPage: totalPages })

    const nextButton = wrapper.find(getDataTestSelector('next-page-button'))
    expect(nextButton.attributes('disabled')).toBe('')
  })
})

/**
 * Options to configure how the page loader button component should be rendered.
 */
interface RenderPageSelectorOptions {
  /** The `query` used to perform a search. */
  query?: string
  /** The `results` used to be rendered. */
  results?: Result[]
  /** The total number of results. */
  totalResults?: number
  /** The current page number. */
  currentPage?: number
  /** Scoped slots to be passed to the mount function. */
  slots?: Record<string, string>
  /** Global aria labels overrides for the component. */
  ariaLabels?: AriaLabels
}

/**
 * Options to configure how the page loader button component should be rendered.
 */
interface RenderPageSelectorAPI {
  /** The wrapper for the page loader button component. */
  wrapper: VueWrapper
  /* A vi spy of the X emit method. */
  emitSpy: ReturnType<typeof vi.spyOn>
  /** The full merged aria labels configuration provided to the component. */
  mergedAriaLabels: AriaLabels
}
