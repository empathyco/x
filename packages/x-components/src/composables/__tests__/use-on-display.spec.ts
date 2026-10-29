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
      scrollTargetId?: string
    },
    element: HTMLElement | Ref<HTMLElement> = document.createElement('div'),
  ): void {
    mount({
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

  it('forwards a custom threshold and rootMargin when provided', () => {
    renderMountedUseOnDisplay({ threshold: 0, rootMargin: '0px 0px 200px 0px' })

    expect(useElementVisibility).toHaveBeenCalledWith(
      expect.any(HTMLElement),
      expect.objectContaining({
        threshold: 0,
        rootMargin: '0px 0px 200px 0px',
      }),
    )
    // It should NOT provide a scroll target when no id is given (viewport fallback)
    const options = (useElementVisibility as any).mock.calls.at(-1)[1]
    expect(options).not.toHaveProperty('scrollTarget')
  })

  it('resolves the scroll target element from the id when it is an ancestor', () => {
    const target = document.createElement('div')
    target.id = 'custom-scroll'
    const inner = document.createElement('div')
    target.appendChild(inner)
    document.body.appendChild(target)

    // The element is passed as a ref, as done by the components that use this composable
    renderMountedUseOnDisplay({ scrollTargetId: 'custom-scroll' }, ref(inner))

    // The element is resolved on mount (SSR-safe), so the ref already holds it
    const options = (useElementVisibility as any).mock.calls.at(-1)[1]
    expect(options.scrollTarget.value).toBe(target)

    target.remove()
  })

  it('does not resolve a scroll target when the id does not match an ancestor', () => {
    const target = document.createElement('div')
    target.id = 'custom-scroll'
    document.body.appendChild(target)
    const unrelated = document.createElement('div')
    document.body.appendChild(unrelated)

    renderMountedUseOnDisplay({ scrollTargetId: 'custom-scroll' }, unrelated)

    const options = (useElementVisibility as any).mock.calls.at(-1)[1]
    // A non-ancestor root is invalid for the IntersectionObserver, so it stays
    // null (viewport) instead of resolving the element
    expect(options.scrollTarget.value).toBeNull()

    target.remove()
    unrelated.remove()
  })

  it('resolves the scroll target when it is an ancestor inside a shadow root', () => {
    // `document.getElementById` cannot reach elements inside a shadow root, so this
    // can only be resolved by looking at the ancestors of the watched element (`closest`).
    const host = document.createElement('div')
    document.body.appendChild(host)
    const shadowRoot = host.attachShadow({ mode: 'open' })
    const target = document.createElement('div')
    target.id = 'custom-scroll'
    shadowRoot.appendChild(target)
    const inner = document.createElement('div')
    target.appendChild(inner)

    // Sanity check: the target is invisible to a global document lookup
    expect(document.getElementById('custom-scroll')).toBeNull()

    renderMountedUseOnDisplay({ scrollTargetId: 'custom-scroll' }, inner)

    const options = (useElementVisibility as any).mock.calls.at(-1)[1]
    expect(options.scrollTarget.value).toBe(target)

    host.remove()
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
