import type { AnyFunction } from '@empathyco/x-utils'
import type { VueWrapper } from '@vue/test-utils'
import type { XEvent } from '../../../wiring'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { getDataTestSelector, installNewXPlugin } from '../../../__tests__/utils'
import { XPlugin } from '../../../plugins/index'
import BaseIdTogglePanelButton from '../base-id-toggle-panel-button.vue'

/**
 * Renders the {@link BaseIdTogglePanelButton} with the provided options.
 *
 * @param options - The options to render the component with.
 * @param options.panelId - panelId option.
 * @param options.slots - Slots option.
 * @returns An small API to test the component.
 */
function renderBaseIdToggleButton({
  panelId = 'myToggle',
  slots = {
    default: `<span data-test="default-slot">Panel: ${panelId}</span>`,
  },
}: RenderBaseIdToggleButtonOptions = {}): RenderBaseIdToggleButtonAPI {
  const containerWrapper = mount(BaseIdTogglePanelButton, {
    props: { panelId },
    global: { plugins: [installNewXPlugin()] },
    slots,
  })

  const wrapper = containerWrapper.findComponent(BaseIdTogglePanelButton)

  return {
    wrapper,
    panelId,
    async click() {
      await wrapper.trigger('click')
    },
    async emit(event: XEvent) {
      await XPlugin.bus.emit(event, true, { id: panelId, moduleName: null })
      await nextTick()
    },
  }
}

describe('testing BaseIdTogglePanelButton component', () => {
  it('emits UserClickedPanelToggleButton with the panel id as payload', async () => {
    const { panelId, click } = renderBaseIdToggleButton()
    const listener = jest.fn()
    XPlugin.bus.on('UserClickedPanelToggleButton').subscribe(listener)

    await click()

    expect(listener).toHaveBeenCalledTimes(1)
    expect(listener).toHaveBeenCalledWith(panelId)
  })

  it('renders a custom slot content', () => {
    const { wrapper } = renderBaseIdToggleButton({
      slots: { default: `<span data-test="custom-slot">Custom slot</span>` },
    })

    expect(wrapper.find(getDataTestSelector('custom-slot')).text()).toEqual('Custom slot')
  })

  it('renders a custom slot using the isPanelOpen property', async () => {
    const { wrapper, emit } = renderBaseIdToggleButton({
      slots: {
        default: `
          <template #default="{ isPanelOpen }">
            <span data-test="custom-slot" v-if="isPanelOpen">Close aside</span>
            <span data-test="custom-slot" v-else>Open aside</span>
          </template>
      `,
      },
    })

    expect(wrapper.find(getDataTestSelector('custom-slot')).text()).toEqual('Open aside')

    await emit('TogglePanelStateChanged')

    expect(wrapper.find(getDataTestSelector('custom-slot')).text()).toEqual('Close aside')
  })
})

interface RenderBaseIdToggleButtonOptions {
  /** Id of the panel to toggle. */
  panelId?: string
  /** The scoped slots to render. */
  slots?: Record<string, string | AnyFunction>
}

interface RenderBaseIdToggleButtonAPI {
  /** The wrapper for the toggle button component. */
  wrapper: VueWrapper
  /** The panel id. */
  panelId: string
  /** Emits the provided event. */
  emit: (event: XEvent) => Promise<void>
  /** Clicks the button. */
  click: () => Promise<void>
}
