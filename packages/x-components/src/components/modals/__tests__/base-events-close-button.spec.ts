import type { VueWrapper } from '@vue/test-utils'
import type { XEvent } from '../../../wiring/events.types'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import { installNewXPlugin } from '../../../__tests__/utils'
import { XPlugin } from '../../../plugins/index'
import BaseEventsModalClose from '../base-events-modal-close.vue'

/**
 * Renders the {@link BaseEventsModalClose} with the provided options.
 *
 * @param options - The options to render the component with.
 * @param options.template - Template option.
 * @param options.closingEvent - Closing event option.
 * @returns An small API to test the component.
 */
function renderBaseEventsModalClose({
  template = '<BaseEventsModalClose :closingEvent="closingEvent"/>',
  closingEvent,
}: RenderBaseEventsModalCloseOptions = {}): RenderBaseEventsModalCloseAPI {
  const modalComponent = defineComponent({
    components: {
      BaseEventsModalClose,
    },
    props: {
      closingEvent: {
        type: String,
      },
    },
    template,
  })

  const wrapper = mount(modalComponent, {
    global: { plugins: [installNewXPlugin()] },
    props: { closingEvent },
  })
  return {
    wrapper: wrapper.findComponent(BaseEventsModalClose),
    async click() {
      await wrapper.trigger('click')
      await nextTick()
    },
  }
}

describe('testing Close Button component', () => {
  it('emits UserClickedCloseEventsModal by default when clicked', async () => {
    const { click } = renderBaseEventsModalClose()
    const listener = jest.fn()
    XPlugin.bus.on('UserClickedCloseEventsModal').subscribe(listener)

    await click()

    expect(listener).toHaveBeenCalledTimes(1)
  })

  it('emits the defined closingEvent when clicked', async () => {
    const { click } = renderBaseEventsModalClose({
      closingEvent: 'UserClickedAFilter',
    })
    const listener = jest.fn()
    XPlugin.bus.on('UserClickedAFilter').subscribe(listener)

    await click()

    expect(listener).toHaveBeenCalledTimes(1)
  })

  it('renders the default slot contents', () => {
    const { wrapper } = renderBaseEventsModalClose({
      template: '<BaseEventsModalClose v-bind="$attrs">Close</BaseEventsModalClose>',
    })

    expect(wrapper.text()).toEqual('Close')
  })
})

interface RenderBaseEventsModalCloseOptions {
  /** The template to render. */
  template?: string
  /** Event that should be emitted when the button is clicked. */
  closingEvent?: XEvent
}

interface RenderBaseEventsModalCloseAPI {
  /** The wrapper for the modal component. */
  wrapper: VueWrapper
  /** Clicks the button. */
  click: () => Promise<void>
}
