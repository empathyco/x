import type { VueWrapper } from '@vue/test-utils'
import type { AriaLabels } from '../../../types'
import type { XEvent } from '../../../wiring/events.types'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, reactive } from 'vue'
import { installNewXPlugin } from '../../../__tests__/utils'
import { XPlugin } from '../../../plugins/index'
import { mergeAccesibilityLabels } from '../../../utils'
import BaseEventsModalClose from '../base-events-modal-close.vue'

/**
 * Builds the `accesibility` injection with the given overrides merged onto the default labels.
 */
function ariaProvide(overrides: AriaLabels = {}): { accesibility: AriaLabels } {
  return { accesibility: reactive(mergeAccesibilityLabels(overrides)) }
}

/**
 * Renders the {@link BaseEventsModalClose} with the provided options.
 *
 * @param options - The options to render the component with.
 * @param options.template - Template option.
 * @param options.closingEvent - Closing event option.
 * @param options.ariaLabels - ariaLabels option.
 * @returns An small API to test the component.
 */
function renderBaseEventsModalClose({
  template = '<BaseEventsModalClose :closingEvent="closingEvent"/>',
  closingEvent,
  ariaLabels,
}: RenderBaseEventsModalCloseOptions = {}): RenderBaseEventsModalCloseAPI {
  const containerWrapper = defineComponent({
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
  const wrapper = mount(containerWrapper, {
    global: { plugins: [installNewXPlugin()], provide: ariaProvide(ariaLabels) },
    props: { closingEvent },
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
    const { wrapper } = renderBaseEventsModalClose({
      ariaLabels: { BaseEventsModalClose: { button: 'Close events modal' } },
    })

    expect(wrapper.attributes('aria-label')).toEqual('Close events modal')
  })

  it('resolves the aria-label of the close button from the global configuration', () => {
    const { wrapper } = renderBaseEventsModalClose({
      ariaLabels: { BaseEventsModalClose: { button: 'Cerrar' } },
    })

    expect(wrapper.attributes('aria-label')).toEqual('Cerrar')
  })
})

interface RenderBaseEventsModalCloseOptions {
  /** The template to render. */
  template?: string
  /** Event that should be emitted when the button is clicked. */
  closingEvent?: XEvent
  /** Global aria labels overrides for the component. */
  ariaLabels?: AriaLabels
}

interface RenderBaseEventsModalCloseAPI {
  /** The wrapper for the modal component. */
  wrapper: VueWrapper
  /** Clicks the button. */
  click: () => Promise<void>
}
