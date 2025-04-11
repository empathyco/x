import type { VueWrapper } from '@vue/test-utils'
import type { XEvent } from '../../../wiring/events.types'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { installNewXPlugin } from '../../../__tests__/utils'
import { XPlugin } from '../../../plugins/index'
import BaseEventsModalOpen from '../base-events-modal-open.vue'
/**
 * Renders the {@link BaseEventsModalOpen} with the provided options.
 *
 * @param options - The options to render the component with.
 * @param options.template - Template option.
 * @param options.openingEvent - Opening event option.
 * @returns An small API to test the component.
 */
function renderBaseEventsModalOpen({
  template = '<BaseEventsModalOpen :openingEvent="openingEvent"/>',
  openingEvent,
}: RenderBaseEventsModalOpenOptions = {}): RenderBaseEventsModalOpenAPI {
  const containerWrapper = defineComponent({
    components: {
      BaseEventsModalOpen,
    },
    props: {
      openingEvent: {
        type: String,
      },
    },
    template,
  })
  const wrapper = mount(containerWrapper, {
    global: { plugins: [installNewXPlugin()] },
    props: { openingEvent },
  })

  return {
    wrapper: wrapper.findComponent(BaseEventsModalOpen),
    click: async () => wrapper.trigger('click'),
  }
}

describe('testing Open Button component', () => {
  it('emits UserClickedOpenX by default when clicked', async () => {
    const { click } = renderBaseEventsModalOpen()
    const listener = jest.fn()
    XPlugin.bus.on('UserClickedOpenEventsModal').subscribe(listener)

    await click()

    expect(listener).toHaveBeenCalledTimes(1)
  })

  it('emits the defined openingEvent when clicked', async () => {
    const { click } = renderBaseEventsModalOpen({
      openingEvent: 'UserClickedAFilter',
    })
    const listener = jest.fn()
    XPlugin.bus.on('UserClickedAFilter').subscribe(listener)

    await click()

    expect(listener).toHaveBeenCalledTimes(1)
  })

  it('renders the default slot contents', () => {
    const { wrapper } = renderBaseEventsModalOpen({
      template: '<BaseEventsModalOpen :openingEvent="openingEvent">Open</BaseEventsModalOpen>',
    })

    expect(wrapper.text()).toEqual('Open')
  })
})

interface RenderBaseEventsModalOpenOptions {
  /** The template to render. */
  template?: string
  /** Event that should be emitted when the button is clicked. */
  openingEvent?: XEvent
}

interface RenderBaseEventsModalOpenAPI {
  /** The wrapper for the modal component. */
  wrapper: VueWrapper
  /** Clicks the button. */
  click: () => Promise<void>
}
