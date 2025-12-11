import type { TaggingRequest } from '@empathyco/x-types'
import type { WireMetadata } from '../../wiring'
import { useElementVisibility } from '@vueuse/core'
import { nextTick, ref } from 'vue'
import { bus } from '../../plugins/index'
import { useEmitDisplayEvent, useOnDisplay } from '../use-on-display'

jest.mock('@vueuse/core', () => ({
  useElementVisibility: jest.fn(),
}))

const refElementVisibility = ref(false)
;(useElementVisibility as jest.Mock).mockReturnValue(refElementVisibility)

const emitSpy = jest.fn()
jest.spyOn(bus, 'emit' as any).mockImplementation(emitSpy)

describe(`testing ${useOnDisplay.name} composable`, () => {
  beforeEach(() => {
    refElementVisibility.value = false
  })

  function renderUseOnDisplayTester({
    element = document.createElement('div'),
    triggerOnce,
  }: RenderUseOnDisplayTesterOptions = {}): RenderUseOnDisplayTesterAPI {
    const callbackSpy = jest.fn()

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

describe(`testing ${useEmitDisplayEvent.name} composable`, () => {
  beforeEach(() => {
    refElementVisibility.value = false
    jest.clearAllMocks()
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
  callbackSpy: jest.Mock
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
