import type { Result } from '@empathyco/x-types'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { getResultsStub } from '../../__stubs__/index'
import { getDataTestSelector, installNewXPlugin } from '../../__tests__/utils'
import { XPlugin } from '../../plugins/index'
import PageLoaderButton from '../page-loader-button.vue'

function renderPageLoaderButton({
  query = 'dress',
  results = getResultsStub(48),
  totalResults = 100,
  slots,
}: RenderPageLoaderButtonOptions = {}): RenderPageLoaderButtonAPI {
  const wrapper = mount(PageLoaderButton, {
    props: {
      buttonClasses: '',
      buttonEvents: {},
    },
    global: { plugins: [installNewXPlugin()] },
    slots,
    data() {
      return {
        query,
        results,
        totalResults,
      }
    },
  })

  return {
    wrapper,
    emitSpy: jest.spyOn(XPlugin.bus, 'emit'),
  }
}

describe('testing PageLoaderButton component', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders a page loader button component with default slots', () => {
    const { wrapper } = renderPageLoaderButton()

    expect(wrapper.find(getDataTestSelector('page-loader')).exists()).toBe(true)
    expect(wrapper.find(getDataTestSelector('text-content')).exists()).toBe(true)
    expect(wrapper.find(getDataTestSelector('load-content')).exists()).toBe(true)
    expect(wrapper.find(getDataTestSelector('load-content')).text().trim()).toBe('Load')
  })

  it('allows customizing its slots', () => {
    const { wrapper } = renderPageLoaderButton({
      slots: {
        textContent: `<p data-test="replaced-slot">Click to see more results</p>`,
        buttonContent: `<span>Load More</span>`,
      },
    })

    expect(wrapper.find(getDataTestSelector('text-content')).exists()).toBe(false)
    expect(wrapper.find(getDataTestSelector('replaced-slot')).exists()).toBe(true)
    expect(wrapper.find(getDataTestSelector('load-content')).exists()).toBe(true)
    expect(wrapper.find(getDataTestSelector('load-content')).text().trim()).toBe('Load More')
  })

  it('renders a base event button with custom button classes if passed as props', async () => {
    const { wrapper } = renderPageLoaderButton()

    await wrapper.setProps({ buttonClasses: 'rounded-full' })
    await wrapper.vm.$nextTick()

    expect(wrapper.find(getDataTestSelector('load-content')).exists()).toBe(true)
    expect(wrapper.find('.rounded-full').exists()).toBe(true)
  })

  it('emits the event UserReachedResultsListEnd when the button is clicked', async () => {
    const { wrapper, emitSpy } = renderPageLoaderButton()
    const baseEventButton = wrapper.find(getDataTestSelector('load-content'))

    await baseEventButton.trigger('click')

    expect(emitSpy).toHaveBeenCalledTimes(1)
    expect(emitSpy).toHaveBeenCalledWith('UserReachedResultsListEnd', undefined, {
      target: baseEventButton.element,
      location: 'none',
      moduleName: null,
      replaceable: true,
    })
  })

  it('emits an event passed via prop', async () => {
    const { wrapper, emitSpy } = renderPageLoaderButton()
    const baseEventButton = wrapper.find(getDataTestSelector('load-content'))

    await wrapper.setProps({ buttonEvents: { UserClickedCloseX: undefined } })
    await wrapper.vm.$nextTick()

    await baseEventButton.trigger('click')
    jest.runAllTimers()

    expect(emitSpy).toHaveBeenCalledTimes(2)
    expect(emitSpy).toHaveBeenCalledWith('UserReachedResultsListEnd', undefined, {
      target: baseEventButton.element,
      location: 'none',
      moduleName: null,
      replaceable: true,
    })
    expect(emitSpy).toHaveBeenCalledWith('UserClickedCloseX', undefined, {
      target: baseEventButton.element,
      location: 'none',
      moduleName: null,
      replaceable: true,
    })
  })
})

/**
 * Options to configure how the page loader button component should be rendered.
 */
interface RenderPageLoaderButtonOptions {
  /** The `query` used to perform a search. */
  query?: string
  /** The `results` used to be rendered. */
  results?: Result[]
  /** The total number of results. */
  totalResults?: number
  /** Scoped slots to be passed to the mount function. */
  slots?: Record<string, string>
}

/**
 * Options to configure how the page loader button component should be rendered.
 */
interface RenderPageLoaderButtonAPI {
  /** The wrapper for the page loader button component. */
  wrapper: VueWrapper
  /* A jest spy of the X emit method. */
  emitSpy: ReturnType<typeof jest.spyOn>
}
