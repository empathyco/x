import type { VueWrapper } from '@vue/test-utils'
import type { XEvent } from '../../../wiring/events.types'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'
import { installNewXPlugin } from '../../../__tests__/utils'
import { resetAriaLabels, useAriaLabels } from '../../../composables/use-aria-labels'
import { XPlugin } from '../../../plugins/index'
import BaseEventsModalOpen from '../base-events-modal-open.vue'
/**
 * Renders the {@link BaseEventsModalOpen} with the provided options.
 *
 * @param options - The options to render the component with.
 * @param options.template - Template option.
 * @param options.openingEvent - Opening event option.
 * @param options.ariaLabel - ariaLabel option.
 * @returns An small API to test the component.
 */
function renderBaseEventsModalOpen({
  template = '<BaseEventsModalOpen :openingEvent="openingEvent" :ariaLabel="ariaLabel"/>',
  openingEvent,
  ariaLabel,
}: RenderBaseEventsModalOpenOptions = {}): RenderBaseEventsModalOpenAPI {
  const containerWrapper = defineComponent({
    components: {
      BaseEventsModalOpen,
    },
    props: {
      openingEvent: {
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
    props: { openingEvent, ariaLabel },
  })

  return {
    wrapper: wrapper.findComponent(BaseEventsModalOpen),
    click: async () => wrapper.trigger('click'),
  }
}

describe('testing Open Button component', () => {
  beforeEach(() => {
    resetAriaLabels()
  })

  it('emits UserClickedOpenX by default when clicked', async () => {
    const { click } = renderBaseEventsModalOpen()
    const listener = vi.fn()
    XPlugin.bus.on('UserClickedOpenEventsModal').subscribe(listener)

    await click()

    expect(listener).toHaveBeenCalledTimes(1)
  })

  it('emits the defined openingEvent when clicked', async () => {
    const { click } = renderBaseEventsModalOpen({
      openingEvent: 'UserClickedAFilter',
    })
    const listener = vi.fn()
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

  it('renders the default aria-label on the open button', () => {
    const { wrapper } = renderBaseEventsModalOpen()

    expect(wrapper.attributes('aria-label')).toEqual('Open')
  })

  it('allows overriding the aria-label of the open button', () => {
    const { wrapper } = renderBaseEventsModalOpen({ ariaLabel: 'Open events modal' })

    expect(wrapper.attributes('aria-label')).toEqual('Open events modal')
  })

  it('resolves the aria-label of the open button from the global configuration when the prop is absent', () => {
    useAriaLabels().set({ BaseEventsModalOpen: { button: 'Abrir' } })
    const { wrapper } = renderBaseEventsModalOpen()

    expect(wrapper.attributes('aria-label')).toEqual('Abrir')
  })

  it('prefers the explicit ariaLabel prop over the global configuration', () => {
    useAriaLabels().set({ BaseEventsModalOpen: { button: 'Abrir' } })
    const { wrapper } = renderBaseEventsModalOpen({ ariaLabel: 'Open events modal' })

    expect(wrapper.attributes('aria-label')).toEqual('Open events modal')
  })
})

interface RenderBaseEventsModalOpenOptions {
  /** The template to render. */
  template?: string
  /** Event that should be emitted when the button is clicked. */
  openingEvent?: XEvent
  /** Accessible label for the open modal button. */
  ariaLabel?: string
}

interface RenderBaseEventsModalOpenAPI {
  /** The wrapper for the modal component. */
  wrapper: VueWrapper
  /** Clicks the button. */
  click: () => Promise<void>
}
