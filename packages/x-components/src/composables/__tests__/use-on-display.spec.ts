import type { TaggingRequest } from '@empathyco/x-types'
import type { Ref } from 'vue'
import type { WireMetadata } from '../../wiring'
import { mount } from '@vue/test-utils'
import { useElementVisibility } from '@vueuse/core'
import { vi } from 'vitest'
import { nextTick, ref } from 'vue'
import { bus } from '../../plugins/index'
import { useEmitDisplayEvent, useOnDisplay } from '../use-on-display'

vi.mock('@vueuse/core', () => ({
  useElementVisibility: vi.fn(),
}))

const refElementVisibility = ref(false)
;(useElementVisibility as any).mockReturnValue(refElementVisibility)

const emitSpy = vi.fn()
vi.spyOn(bus, 'emit' as any).mockImplementation(emitSpy)

describe(`testing ${useOnDisplay.name} composable`, () => {
  beforeEach(() => {
    refElementVisibility.value = false
  })

  function renderUseOnDisplayTester({
    element = document.createElement('div'),
    triggerOnce,
  }: RenderUseOnDisplayTesterOptions = {}): RenderUseOnDisplayTesterAPI {
    const callbackSpy = vi.fn()

    const { isElementVisible, unwatchDisplay } = useOnDisplay({
      element,
      callback: callbackSpy,
      ...(!triggerOnce && { triggerOnce }),
    })

    const toggleElementVisibility = async (): Promise<void> => {
      refElementVisibility.value = !refElementVisibility.value
      await nextTick()
    }

    return {
      callbackSpy,
      toggleElementVisibility,
      isElementVisible,
      unwatchDisplay,
    }
  }

  it('uses the useElementVisibility composable underneath', () => {
    renderUseOnDisplayTester()
    expect(useElementVisibility).toHaveBeenCalled()
  })

  it('uses a provided element for useElementVisibility to watch', () => {
    const element = document.createElement('div')
    renderUseOnDisplayTester({ element })
    expect(useElementVisibility).toHaveBeenCalledWith(element, { threshold: 0.1 })
  })

  it('triggers callback when the element changes from not visible to visible', async () => {
    const { callbackSpy, toggleElementVisibility } = renderUseOnDisplayTester()

    await toggleElementVisibility()

    expect(callbackSpy).toHaveBeenCalled()
  })

  it('triggers the callback only once by default and when passing true', async () => {
    let useOnDisplayReturn = renderUseOnDisplayTester()

    await useOnDisplayReturn.toggleElementVisibility()
    await useOnDisplayReturn.toggleElementVisibility()
    await useOnDisplayReturn.toggleElementVisibility()

    expect(useOnDisplayReturn.callbackSpy).toHaveBeenCalledTimes(1)

    useOnDisplayReturn = renderUseOnDisplayTester({ triggerOnce: true })

    await useOnDisplayReturn.toggleElementVisibility()
    await useOnDisplayReturn.toggleElementVisibility()
    await useOnDisplayReturn.toggleElementVisibility()

    expect(useOnDisplayReturn.callbackSpy).toHaveBeenCalledTimes(1)
  })

  it('can remove the triggering repetition limitation', async () => {
    const { callbackSpy, toggleElementVisibility } = renderUseOnDisplayTester({
      triggerOnce: false,
    })

    await toggleElementVisibility()
    await toggleElementVisibility()
    await toggleElementVisibility()

    expect(callbackSpy).toHaveBeenCalledTimes(2)
  })

  it('exposes the current visibility of the element', async () => {
    const { toggleElementVisibility, isElementVisible } = renderUseOnDisplayTester()

    expect(isElementVisible.value).toBe(false)

    await toggleElementVisibility()
    expect(isElementVisible.value).toBe(true)

    await toggleElementVisibility()
    expect(isElementVisible.value).toBe(false)
  })

  it('exposes the watch stop handle for the callback', async () => {
    const { callbackSpy, toggleElementVisibility, unwatchDisplay } = renderUseOnDisplayTester()

    unwatchDisplay()

    await toggleElementVisibility()
    expect(callbackSpy).not.toHaveBeenCalled()
  })
})

describe(`testing ${useOnDisplay.name} custom options`, () => {
  beforeEach(() => {
    refElementVisibility.value = false
    vi.clearAllMocks()
  })

  function renderMountedUseOnDisplay(
    options: {
      threshold?: number
      rootMargin?: string
      scrollContainerAsRoot?: boolean
    },
    element: HTMLElement | Ref<HTMLElement> = document.createElement('div'),
  ) {
    return mount({
      setup() {
        useOnDisplay({
          element,
          callback: vi.fn(),
          ...options,
        })
        return () => null
      },
    })
  }

  function getScrollTarget() {
    return (useElementVisibility as any).mock.calls.at(-1)[1].scrollTarget
  }

  /**
   * Creates an element that can scroll vertically. JSDOM has no layout, so the sizes that tell
   * if its content overflows it are faked.
   *
   * @param options - The `overflow-y` value and whether its content overflows it.
   * @returns The element and a function to change if its content overflows it.
   */
  function createScrollContainer({ overflowY = 'auto', overflows = true } = {}) {
    const container = document.createElement('div')
    container.style.overflowY = overflowY
    let scrollHeight = overflows ? 2000 : 500
    Object.defineProperty(container, 'clientHeight', { configurable: true, get: () => 500 })
    Object.defineProperty(container, 'scrollHeight', {
      configurable: true,
      get: () => scrollHeight,
    })
    return {
      container,
      setOverflows: (newOverflows: boolean) => (scrollHeight = newOverflows ? 2000 : 500),
    }
  }

  it('forwards a custom threshold and rootMargin when provided', () => {
    renderMountedUseOnDisplay({ threshold: 0, rootMargin: '0px 0px 200px 0px' })

    expect(useElementVisibility).toHaveBeenCalledWith(
      expect.any(HTMLElement),
      expect.objectContaining({
        threshold: 0,
        rootMargin: '0px 0px 200px 0px',
      }),
    )
    // It should NOT provide a scroll target unless requested (viewport)
    const options = (useElementVisibility as any).mock.calls.at(-1)[1]
    expect(options).not.toHaveProperty('scrollTarget')
  })

  it('uses the nearest ancestor that scrolls the element as root', () => {
    const { container: outer } = createScrollContainer()
    const { container: inner } = createScrollContainer()
    const wrapper = document.createElement('div')
    const element = document.createElement('div')
    outer.appendChild(inner)
    inner.appendChild(wrapper)
    wrapper.appendChild(element)
    document.body.appendChild(outer)

    // The element is passed as a ref, as done by the components that use this composable
    renderMountedUseOnDisplay({ scrollContainerAsRoot: true }, ref(element))

    // It is resolved on mount (SSR-safe), so the ref already holds it
    expect(getScrollTarget().value).toBe(inner)

    outer.remove()
  })

  it('skips ancestors that do not scroll or whose content does not overflow them', () => {
    // e.g. `MainScroll` with `useWindow` (`overflow: visible`), or a scroll container that
    // grows with its content, inside a modal that is the one scrolling
    const { container: modal } = createScrollContainer()
    const { container: notScrolling } = createScrollContainer({ overflowY: 'visible' })
    const { container: notOverflowing } = createScrollContainer({ overflows: false })
    const element = document.createElement('div')
    modal.appendChild(notScrolling)
    notScrolling.appendChild(notOverflowing)
    notOverflowing.appendChild(element)
    document.body.appendChild(modal)

    renderMountedUseOnDisplay({ scrollContainerAsRoot: true }, element)

    expect(getScrollTarget().value).toBe(modal)

    modal.remove()
  })

  it('uses the viewport when no ancestor scrolls the element', () => {
    const { container: notScrolling } = createScrollContainer({ overflowY: 'visible' })
    const element = document.createElement('div')
    notScrolling.appendChild(element)
    document.body.appendChild(notScrolling)

    renderMountedUseOnDisplay({ scrollContainerAsRoot: true }, element)

    expect(getScrollTarget().value).toBeNull()

    notScrolling.remove()
  })

  it('resolves the scroll container across shadow roots', () => {
    const { container: outer } = createScrollContainer()
    const host = document.createElement('div')
    outer.appendChild(host)
    document.body.appendChild(outer)
    const shadowRoot = host.attachShadow({ mode: 'open' })
    const element = document.createElement('div')
    shadowRoot.appendChild(element)

    renderMountedUseOnDisplay({ scrollContainerAsRoot: true }, element)

    expect(getScrollTarget().value).toBe(outer)

    outer.remove()
  })

  it('resolves the scroll container again when an ancestor is resized', () => {
    let resizeCallback: () => void = () => {}
    const observeSpy = vi.fn()
    const disconnectSpy = vi.fn()
    vi.stubGlobal(
      'ResizeObserver',
      class {
        constructor(callback: () => void) {
          resizeCallback = callback
        }
        observe = observeSpy
        disconnect = disconnectSpy
      },
    )
    const { container: modal } = createScrollContainer()
    const { container: mainScroll, setOverflows } = createScrollContainer()
    const element = document.createElement('div')
    modal.appendChild(mainScroll)
    mainScroll.appendChild(element)
    document.body.appendChild(modal)

    const wrapper = renderMountedUseOnDisplay({ scrollContainerAsRoot: true }, element)
    expect(observeSpy).toHaveBeenCalledWith(mainScroll)
    expect(observeSpy).toHaveBeenCalledWith(modal)
    expect(getScrollTarget().value).toBe(mainScroll)

    // The main scroll grows with its content, so the modal is the one scrolling now
    setOverflows(false)
    resizeCallback()
    expect(getScrollTarget().value).toBe(modal)

    setOverflows(true)
    resizeCallback()
    expect(getScrollTarget().value).toBe(mainScroll)

    wrapper.unmount()
    expect(disconnectSpy).toHaveBeenCalled()

    modal.remove()
    vi.unstubAllGlobals()
  })
})

describe(`testing ${useEmitDisplayEvent.name} composable`, () => {
  beforeEach(() => {
    refElementVisibility.value = false
    vi.clearAllMocks()
  })

  function renderUseEmitDisplayEvent({
    element = document.createElement('div'),
    taggingRequest = {
      url: '',
      params: {},
    },
    eventMetadata = {},
  }: RenderUseEmitDisplayEventOptions = {}): RenderUseEmitDisplayEventAPI {
    const { isElementVisible, unwatchDisplay } = useEmitDisplayEvent({
      element,
      taggingRequest,
      eventMetadata,
    })

    const toggleElementVisibility = async (): Promise<void> => {
      refElementVisibility.value = !refElementVisibility.value
      await nextTick()
    }

    return {
      toggleElementVisibility,
      isElementVisible,
      unwatchDisplay,
    }
  }

  it('uses the useElementVisibility composable underneath', () => {
    renderUseEmitDisplayEvent()
    expect(useElementVisibility).toHaveBeenCalled()
  })

  it('uses a provided element for useElementVisibility to watch', () => {
    const element = document.createElement('div')
    renderUseEmitDisplayEvent({ element })
    expect(useElementVisibility).toHaveBeenCalledWith(element, { threshold: 0.1 })
  })

  it('emits `TrackableElementDisplayed` when the element is visible with the provided tagging request converted to display taggable', async () => {
    const taggingRequest = {
      url: 'test-url',
      params: { test: 'param' },
    }

    const { toggleElementVisibility } = renderUseEmitDisplayEvent({
      taggingRequest,
    })

    await toggleElementVisibility()

    expect(emitSpy).toHaveBeenCalled()
    expect(emitSpy).toHaveBeenCalledWith(
      'TrackableElementDisplayed',
      {
        tagging: {
          display: taggingRequest,
        },
      },
      expect.anything(),
    )
  })

  it('emits `TrackableElementDisplayed` when the element is visible with the provided event metadata', async () => {
    const eventMetadata = {
      feature: 'test-feature',
      location: 'test-location',
    }

    const { toggleElementVisibility } = renderUseEmitDisplayEvent({
      eventMetadata,
    })

    await toggleElementVisibility()

    expect(emitSpy).toHaveBeenCalled()
    expect(emitSpy).toHaveBeenCalledWith(
      'TrackableElementDisplayed',
      expect.anything(),
      expect.objectContaining({ ...eventMetadata }),
    )
  })

  it('emits the event only once', async () => {
    const { toggleElementVisibility } = renderUseEmitDisplayEvent()

    await toggleElementVisibility()
    await toggleElementVisibility()
    await toggleElementVisibility()

    expect(emitSpy).toHaveBeenCalledTimes(1)
  })

  it('exposes the current visibility of the element', async () => {
    const { toggleElementVisibility, isElementVisible } = renderUseEmitDisplayEvent()

    expect(isElementVisible.value).toBe(false)

    await toggleElementVisibility()
    expect(isElementVisible.value).toBe(true)

    await toggleElementVisibility()
    expect(isElementVisible.value).toBe(false)
  })

  it('exposes the watch stop handle for the callback', async () => {
    const { toggleElementVisibility, unwatchDisplay } = renderUseEmitDisplayEvent()

    unwatchDisplay()

    await toggleElementVisibility()
    expect(emitSpy).not.toHaveBeenCalled()
  })
})

/**
 * Options to configure how the useOnDisplay composable should be rendered.
 */
interface RenderUseOnDisplayTesterOptions {
  /** The element to watch. */
  element?: HTMLElement
  /** Whether the callback should be triggered only once or not. */
  triggerOnce?: boolean
}

/**
 * Tools to test how the useOnDisplay composable behaves.
 */
interface RenderUseOnDisplayTesterAPI {
  /** The callback spy. */
  callbackSpy: ReturnType<typeof vi.fn>
  /** Toggle element visibility. */
  isElementVisible: ReturnType<typeof useElementVisibility>
  /** The watch stop handle for the callback. */
  unwatchDisplay: () => void
  /** Toggle element visibility. */
  toggleElementVisibility: () => Promise<void>
}

/**
 * Options to configure how the useEmitDisplayEvent composable should be rendered.
 */
interface RenderUseEmitDisplayEventOptions {
  /** The element to watch. */
  element?: HTMLElement
  /** The payload for the `TrackableElementDisplayed` event. */
  taggingRequest?: TaggingRequest
  /** The event metadata. */
  eventMetadata?: Omit<WireMetadata, 'moduleName' | 'origin' | 'location'>
}

/**
 * Tools to test how the useOnDisplay composable behaves.
 */
interface RenderUseEmitDisplayEventAPI {
  /** The visibility of the element. */
  isElementVisible: ReturnType<typeof useElementVisibility>
  /** The watch stop handle for the callback. */
  unwatchDisplay: () => void
  /** Toggle element visibility. */
  toggleElementVisibility: () => Promise<void>
}
