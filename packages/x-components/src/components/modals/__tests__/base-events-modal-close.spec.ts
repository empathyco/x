import type { VueWrapper } from '@vue/test-utils'
import type { XEvent } from '../../../wiring/events.types'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'
import { installNewXPlugin } from '../../../__tests__/utils'
import { XPlugin } from '../../../plugins/index'
import BaseEventsModalClose from '../base-events-modal-close.vue'

/**
 * Renders the {@link BaseEventsModalClose} with the provided options.
 *
 * @param options - The options to render the component with.
 * @param options.template - Template option.
 * @param options.closingEvent - Closing event option.
 * @param options.ariaLabel - ariaLabel option.
 * @returns An small API to test the component.
 */
function renderBaseEventsModalClose({
  template = '<BaseEventsModalClose :closingEvent="closingEvent" :ariaLabel="ariaLabel"/>',
  closingEvent,
  ariaLabel,
}: RenderBaseEventsModalCloseOptions = {}): RenderBaseEventsModalCloseAPI {
  const containerWrapper = defineComponent({
    components: {
      BaseEventsModalClose,
    },
    props: {
      closingEvent: {
        type: String,
      },
      ariaLabel: {
        type: String,
      },
    },
    template,
  })
  const wrapper = mount(containerWrapper, {
    global: { plugins: [installNewXPlugin()] },
    props: { closingEvent, ariaLabel },
  })

  return {
    wrapper: wrapper.findComponent(BaseEventsModalClose),
    click: async () => wrapper.trigger('click'),
  }
}

describe('testing Close Button component', () => {
  it('emits UserClickedCloseEventsModal by default when clicked', async () => {
    const { click } = renderBaseEventsModalClose()
    const listener = vi.fn()
    XPlugin.bus.on('UserClickedCloseEventsModal').subscribe(listener)

    await click()

    expect(listener).toHaveBeenCalledTimes(1)
  })

  it('emits the defined closingEvent when clicked', async () => {
    const { click } = renderBaseEventsModalClose({
      closingEvent: 'UserClickedAFilter',
    })
    const listener = vi.fn()
    XPlugin.bus.on('UserClickedAFilter').subscribe(listener)

    await click()

    expect(listener).toHaveBeenCalledTimes(1)
  })

  it('renders the default aria-label on the close button', () => {
    const { wrapper } = renderBaseEventsModalClose()

    expect(wrapper.attributes('aria-label')).toEqual('Close')
  })

  it('allows overriding the aria-label of the close button', () => {
    const { wrapper } = renderBaseEventsModalClose({ ariaLabel: 'Close events modal' })

    expect(wrapper.attributes('aria-label')).toEqual('Close events modal')
  })
})

interface RenderBaseEventsModalCloseOptions {
  /** The template to render. */
  template?: string
  /** Event that should be emitted when the button is clicked. */
  closingEvent?: XEvent
  /** Accessible label for the close modal button. */
  ariaLabel?: string
}

interface RenderBaseEventsModalCloseAPI {
  /** The wrapper for the modal component. */
  wrapper: VueWrapper
  /** Clicks the button. */
  click: () => Promise<void>
}
