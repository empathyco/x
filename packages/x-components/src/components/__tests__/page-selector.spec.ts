import type { Result } from '@empathyco/x-types'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { getResultsStub } from '../../__stubs__/index'
import { getDataTestSelector, installNewXPlugin } from '../../__tests__/utils'
import { XPlugin } from '../../plugins/index'
import PageSelector from '../page-selector.vue'

interface PageItem {
  value: number | string
  isSelected: boolean
}

function renderPageSelector({
  query = 'dress',
  results = getResultsStub(240),
  totalResults = 240,
  currentPage = 1,
  slots,
}: RenderPageSelectorOptions = {}): RenderPageSelectorAPI {
  const wrapper = mount(PageSelector, {
    props: {
      totalPages: Math.round(totalResults / 24),
      currentPage,
      range: 2,
      scrollTarget: 'dummy-target',
    },
    global: { plugins: [installNewXPlugin()] },
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
    emitSpy: jest.spyOn(XPlugin.bus, 'emit'),
  }
}

describe('testing PageSelector component', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })

  beforeEach(() => {
    jest.clearAllMocks()
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
}

/**
 * Options to configure how the page loader button component should be rendered.
 */
interface RenderPageSelectorAPI {
  /** The wrapper for the page loader button component. */
  wrapper: VueWrapper
  /* A jest spy of the X emit method. */
  emitSpy: ReturnType<typeof jest.spyOn>
}
