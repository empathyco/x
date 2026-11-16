import type { Result } from '@empathyco/x-types'
import type { DOMWrapper, VueWrapper } from '@vue/test-utils'
import type { AriaLabels } from '../../types'
import { mount } from '@vue/test-utils'
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { getResultsStub } from '../../__stubs__/index'
import { ariaProvide, getDataTestSelector, installNewXPlugin } from '../../__tests__/utils'
import { XPlugin } from '../../plugins/index'
import { ACCESSIBILITY_KEY } from '../../types'
import PageSelector from '../page-selector.vue'

function renderPageSelector({
  query = 'dress',
  results = getResultsStub(240),
  totalResults = 240,
  currentPage = 1,
  slots,
  ariaLabels,
}: RenderPageSelectorOptions = {}): RenderPageSelectorAPI {
  const mergedAriaLabels = ariaProvide(ariaLabels)[ACCESSIBILITY_KEY]
  const wrapper = mount(PageSelector, {
    props: {
      totalPages: Math.round(totalResults / 24),
      currentPage,
      range: 2,
      scrollTarget: 'dummy-target',
    },
    global: { plugins: [installNewXPlugin()], provide: { [ACCESSIBILITY_KEY]: mergedAriaLabels } },
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
    pagination: wrapper.find('.x-page-selector'),
    previousPageButton: wrapper.find(getDataTestSelector('previous-page-button')),
    nextPageButton: wrapper.find(getDataTestSelector('next-page-button')),
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
    const { previousPageButton, nextPageButton } = renderPageSelector()

    expect(previousPageButton.exists()).toBe(true)
    expect(previousPageButton.text().trim()).toBe('Prev')
    expect(nextPageButton.exists()).toBe(true)
    expect(nextPageButton.text().trim()).toBe('Next')
  })

  it('renders the default aria-labels on the pagination nav and the prev/next buttons', () => {
    const { pagination, previousPageButton, nextPageButton } = renderPageSelector()

    expect(pagination.attributes('aria-label')).toBe('Pagination')
    expect(previousPageButton.attributes('aria-label')).toBe('Previous page')
    expect(nextPageButton.attributes('aria-label')).toBe('Next page')
  })

  it('allows overriding the aria-labels through the global configuration', () => {
    const { pagination, previousPageButton, nextPageButton } = renderPageSelector({
      ariaLabels: {
        pageSelector: {
          pagination: 'Page navigation',
          prevPage: 'Go to previous page',
          nextPage: 'Go to next page',
        },
      },
    })

    expect(pagination.attributes('aria-label')).toBe('Page navigation')
    expect(previousPageButton.attributes('aria-label')).toBe('Go to previous page')
    expect(nextPageButton.attributes('aria-label')).toBe('Go to next page')
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
    const { pagination, previousPageButton, nextPageButton } = renderPageSelector({
      ariaLabels: {
        pageSelector: {
          pagination: 'Paginación',
          prevPage: 'Página anterior',
          nextPage: 'Página siguiente',
        },
      },
    })

    expect(pagination.attributes('aria-label')).toBe('Paginación')
    expect(previousPageButton.attributes('aria-label')).toBe('Página anterior')
    expect(nextPageButton.attributes('aria-label')).toBe('Página siguiente')
  })

  it('applies the global numberPage function per page and updates it at runtime without re-mount', async () => {
    const { mergedAriaLabels, wrapper } = renderPageSelector()

    expect(wrapper.find(getDataTestSelector('page-button-1')).attributes('aria-label')).toBe(
      'Page 1',
    )

    mergedAriaLabels.pageSelector!.numberPage = (page: number | string) => `Página ${page}`
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
    const { previousPageButton, nextPageButton, wrapper } = renderPageSelector({
      slots: {
        'previous-page-button': '<span><</span>',
        'page-button-1': '<h2>1</h2>',
        'next-page-button': '<span>></span>',
      },
    })

    expect(previousPageButton.exists()).toBe(true)
    expect(previousPageButton.text().trim()).toBe('<')
    expect(wrapper.find(getDataTestSelector('page-button-1')).exists()).toBe(true)
    expect(wrapper.find(getDataTestSelector('page-button-1')).text().trim()).toBe('1')
    expect(nextPageButton.exists()).toBe(true)
    expect(nextPageButton.text().trim()).toBe('>')
  })

  it('emits UserSelectedAPage and UserClickedScrollToTop events when enabled buttons are clicked', async () => {
    const { emitSpy, nextPageButton } = renderPageSelector()

    await nextPageButton.trigger('click')

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
    const { previousPageButton } = renderPageSelector()

    expect(previousPageButton.attributes('disabled')).toBe('')
  })

  it('disables the next-page-button if we are on the last page', () => {
    const totalPages = Math.round(240 / 24)
    const { nextPageButton } = renderPageSelector({ currentPage: totalPages })

    expect(nextPageButton.attributes('disabled')).toBe('')
  })
})

/**
 * Options to configure how the page selector component should be rendered.
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
 * Elements and helpers returned by `renderPageSelector`.
 */
interface RenderPageSelectorAPI {
  /** The wrapper for the page selector component. */
  wrapper: VueWrapper
  /* A vi spy of the X emit method. */
  emitSpy: ReturnType<typeof vi.spyOn>
  /** The full merged aria labels configuration provided to the component. */
  mergedAriaLabels: AriaLabels
  /** The root pagination element (`.x-page-selector`). */
  pagination: DOMWrapper<Element>
  /** The previous page button. */
  previousPageButton: DOMWrapper<Element>
  /** The next page button. */
  nextPageButton: DOMWrapper<Element>
}
