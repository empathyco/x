import type { DOMWrapper, VueWrapper } from '@vue/test-utils'
import type { PropsWithType } from '../../../utils/types'
import type { XEvent, XEventsTypes } from '../../../wiring/events.types'
import { mount } from '@vue/test-utils'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { ariaProvide, getDataTestSelector, installNewXPlugin } from '../../../__tests__/utils'
import { XPlugin } from '../../../plugins'
import BaseEventsModal from '../base-events-modal.vue'

class MockResizeObserver implements ResizeObserver {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
}

window.ResizeObserver = MockResizeObserver as any

/**
 * Mounts a {@link BaseEventsModal} component with the provided options and offers an API to easily
 * test it.
 *
 * @param options - The options to render the component with.
 * @param options.defaultSlot - defaultSlot option.
 * @param options.bodyClickEvent - bodyClickEvent option.
 * @param options.eventsToCloseModal - eventsToCloseModal option.
 * @param options.eventsToOpenModal - eventsToOpenModal option.
 * @param options.contentClass - contentClass option.
 * @param options.escapeCloseEvent - escapeCloseEvent option.
 * @returns An API to test the component.
 */
function mountBaseEventsModal({
  defaultSlot = '<span data-test="default-slot">Modal</span>',
  bodyClickEvent,
  eventsToCloseModal,
  eventsToOpenModal,
  contentClass,
  escapeCloseEvent,
}: MountBaseEventsModalOptions = {}): MountBaseEventsModalAPI {
  const parent = document.createElement('div')
  document.body.appendChild(parent)

  const wrapper = mount(BaseEventsModal, {
    attachTo: parent,
    props: {
      bodyClickEvent,
      eventsToCloseModal,
      eventsToOpenModal,
      contentClass,
      escapeCloseEvent,
    },
    slots: {
      default: defaultSlot,
    },
    global: { plugins: [installNewXPlugin()], provide: ariaProvide() },
  })

  return {
    wrapper,
    async clickModalOverlay() {
      await wrapper.find(getDataTestSelector('modal-overlay'))?.trigger('click')
    },
    async emit(event) {
      await XPlugin.bus.emit(event, undefined)
    },
    getModalContent() {
      return wrapper.find(getDataTestSelector('modal-content'))
    },
    async fakeFocusIn() {
      vi.runAllTimers()
      document.body.dispatchEvent(new FocusEvent('focusin'))
      await nextTick()
    },
  }
}

describe('testing Base Events Modal  component', () => {
  beforeAll(() => {
    vi.useFakeTimers()
  })

  afterAll(() => {
    vi.useRealTimers()
  })

  it('opens and closes when UserClickedOpenX and UserClickedClosedX are emitted', async () => {
    const { emit, getModalContent } = mountBaseEventsModal()
    expect(getModalContent().exists()).toBe(false)

    await emit('UserClickedOpenEventsModal')
    expect(getModalContent().exists()).toBe(true)

    await emit('UserClickedCloseEventsModal')
    expect(getModalContent().exists()).toBe(false)
  })

  it('closes when clicking on the modal overlay', async () => {
    const { clickModalOverlay, emit, getModalContent } = mountBaseEventsModal()

    await emit('UserClickedOpenEventsModal')
    expect(getModalContent().exists()).toBe(true)

    await clickModalOverlay()
    expect(getModalContent().exists()).toBe(false)
  })

  it('closes when focusing any other element out of the modal', async () => {
    const { emit, fakeFocusIn, getModalContent } = mountBaseEventsModal()

    await emit('UserClickedOpenEventsModal')
    expect(getModalContent().exists()).toBe(true)

    await fakeFocusIn()
    expect(getModalContent().exists()).toBe(false)
  })

  it('does not close when clicking inside the content', async () => {
    const { wrapper, emit, getModalContent } = mountBaseEventsModal({
      defaultSlot: `
        <button data-test="test-button">Modal should still be opened when I'm clicked</button>
      `,
    })

    await emit('UserClickedOpenEventsModal')
    expect(getModalContent().exists()).toBe(true)

    await wrapper.find(getDataTestSelector('test-button')).trigger('click')
    expect(getModalContent().exists()).toBe(true)
  })

  it('allows to customize the events listened for opening & closing', async () => {
    const eventToOpen = 'UserFocusedSearchBox'
    const eventToClose = 'UserPressedClearSearchBoxButton'
    const { emit, getModalContent } = mountBaseEventsModal({
      eventsToOpenModal: [eventToOpen],
      eventsToCloseModal: [eventToClose],
    })

    const openListener = vi.fn()
    XPlugin.bus.on(eventToOpen).subscribe(openListener)
    const closeListener = vi.fn()
    XPlugin.bus.on(eventToClose).subscribe(closeListener)

    await emit(eventToOpen)
    expect(getModalContent().exists()).toBe(true)
    expect(openListener).toHaveBeenCalled()

    await emit(eventToClose)
    expect(getModalContent().exists()).toBe(false)
    expect(closeListener).toHaveBeenCalled()
  })

  it('allows to customize the event emitted when clicking out of the modal', async () => {
    const bodyClickEvent = 'UserClickedASimpleFilter'
    const { clickModalOverlay, emit, getModalContent } = mountBaseEventsModal({
      bodyClickEvent,
      eventsToCloseModal: [bodyClickEvent],
    })
    const listener = vi.fn()
    XPlugin.bus.on(bodyClickEvent).subscribe(listener)

    await emit('UserClickedOpenEventsModal')
    expect(getModalContent().exists()).toBe(true)

    await clickModalOverlay()
    expect(listener).toHaveBeenCalledTimes(1)
    expect(getModalContent().exists()).toBe(false)
  })

  it('allows adding classes to the modal content', async () => {
    const { getModalContent, emit } = mountBaseEventsModal({
      contentClass: 'test-class',
    })

    await emit('UserClickedOpenEventsModal')
    expect(getModalContent().classes()).toContain('test-class')
  })

  describe('escapeCloseEvent', () => {
    it('emits the escapeCloseEvent when the Escape key is pressed while the modal is open', async () => {
      const escapeCloseEvent = 'UserClickedCloseX'
      const { emit, wrapper, getModalContent } = mountBaseEventsModal({
        escapeCloseEvent,
        eventsToCloseModal: [escapeCloseEvent],
      })
      const listener = vi.fn()
      XPlugin.bus.on(escapeCloseEvent).subscribe(listener)

      await emit('UserClickedOpenEventsModal')
      expect(getModalContent().exists()).toBe(true)

      await wrapper.trigger('keydown', { key: 'Escape' })

      expect(listener).toHaveBeenCalledTimes(1)
      expect(getModalContent().exists()).toBe(false)
    })

    it('does not emit any event when the Escape key is pressed with the default (null) escapeCloseEvent', async () => {
      const { emit, wrapper, getModalContent } = mountBaseEventsModal()
      const listener = vi.fn()
      XPlugin.bus.on('UserClickedCloseEventsModal').subscribe(listener)
      XPlugin.bus.on('UserClickedOutOfEventsModal').subscribe(listener)

      await emit('UserClickedOpenEventsModal')
      expect(getModalContent().exists()).toBe(true)

      await wrapper.trigger('keydown', { key: 'Escape' })

      expect(listener).not.toHaveBeenCalled()
      expect(getModalContent().exists()).toBe(true)
    })

    it('does not emit the escapeCloseEvent when the Escape key is pressed while the modal is closed', async () => {
      const escapeCloseEvent = 'UserClickedCloseX'
      const { wrapper } = mountBaseEventsModal({
        escapeCloseEvent,
        eventsToCloseModal: [escapeCloseEvent],
      })
      const listener = vi.fn()
      XPlugin.bus.on(escapeCloseEvent).subscribe(listener)

      await wrapper.trigger('keydown', { key: 'Escape' })

      expect(listener).not.toHaveBeenCalled()
    })
  })

  describe('focus restoration', () => {
    it('restores the focus to the opener element when the modal closes', async () => {
      const opener = document.createElement('button')
      document.body.appendChild(opener)
      const { getModalContent } = mountBaseEventsModal({
        defaultSlot: '<button data-test="modal-button">Content</button>',
      })

      await XPlugin.bus.emit('UserClickedOpenEventsModal', undefined, {
        target: opener,
        moduleName: null,
      })
      await nextTick()
      expect(getModalContent().exists()).toBe(true)

      // The focus is inside the modal when it closes (e.g. the user pressed Escape in it)
      ;(getModalContent().find('button').element as HTMLButtonElement).focus()

      await XPlugin.bus.emit('UserClickedCloseEventsModal', undefined)
      await nextTick()
      await nextTick()

      expect(getModalContent().exists()).toBe(false)
      expect(document.activeElement).toBe(opener)
    })

    it('does not restore the focus to the opener when the user moves the focus out of the modal', async () => {
      const opener = document.createElement('button')
      document.body.appendChild(opener)
      const other = document.createElement('button')
      document.body.appendChild(other)
      const { fakeFocusIn, getModalContent } = mountBaseEventsModal()

      other.focus()
      await XPlugin.bus.emit('UserClickedOpenEventsModal', undefined, {
        target: opener,
        moduleName: null,
      })
      await nextTick()
      expect(getModalContent().exists()).toBe(true)

      // The user tabs past the last focusable element: focusin fires out of the modal
      await fakeFocusIn()

      expect(getModalContent().exists()).toBe(false)
      await nextTick()
      await nextTick()
      expect(document.activeElement).toBe(other)
    })
  })
})

interface MountBaseEventsModalOptions {
  /** The default slot to render. */
  defaultSlot?: string
  /** The event that should be emitted when the body is clicked. */
  bodyClickEvent?: XEvent
  /** Events that when emitted should close the modal. */
  eventsToCloseModal?: XEvent[]
  /** Events that when emitted should open the modal. */
  eventsToOpenModal?: XEvent[]
  /** Class to add to the content element of the modal. */
  contentClass?: string
  /** The event emitted when the Escape key is pressed while the modal is open. */
  escapeCloseEvent?: XEvent | null
}

interface MountBaseEventsModalAPI {
  /** The wrapper for the modal component. */
  wrapper: VueWrapper
  /** Fakes a click on the modal overlay. */
  clickModalOverlay: () => Promise<void>
  /** Emits the provided event. */
  emit: (event: PropsWithType<XEventsTypes, void>) => Promise<void>
  /** Fakes a focusin event in another HTMLElement of the body. */
  fakeFocusIn: () => Promise<void>
  /** Retrieves the modal content. */
  getModalContent: () => DOMWrapper<Element>
}
