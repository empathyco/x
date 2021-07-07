/**
 * Renders the {@link BaseIdTogglePanelButton} with the provided options.
 *
 * @param options - The options to render the component with.
 * @returns An small API to test the component.
 */
import { mount, Wrapper } from '@vue/test-utils';
import { getDataTestSelector, installNewXPlugin } from '../../../__tests__/utils';
import { AnyFunction } from '../../../utils';
import { XEvent } from '../../../wiring';
import BaseIdTogglePanelButton from '../base-id-toggle-panel-button.vue';

function renderBaseIdToggleButton({
  panelId = 'myToggle',
  scopedSlots = {
    default: `<span data-test="default-slot">Panel: ${panelId}</span>`
  }
}: RenderBaseIdToggleButtonOptions = {}): RenderBaseIdToggleButtonAPI {
  const [, localVue] = installNewXPlugin();
  const containerWrapper = mount(BaseIdTogglePanelButton, {
    localVue,
    propsData: { panelId },
    scopedSlots
  });

  const wrapper = containerWrapper.findComponent(BaseIdTogglePanelButton);

  return {
    wrapper,
    panelId,
    async click() {
      await wrapper.trigger('click');
    },
    async emit(event: XEvent) {
      wrapper.vm.$x.emit(event, true, { id: panelId });
      await localVue.nextTick();
    }
  };
}

describe('testing BaseIdTogglePanelButton component', () => {
  it('emits UserClickedPanelToggleButton with the panel id as payload', async () => {
    const { wrapper, panelId, click } = renderBaseIdToggleButton();
    const listener = jest.fn();
    wrapper.vm.$x.on('UserClickedPanelToggleButton').subscribe(listener);

    await click();

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(panelId);
  });

  it('renders a custom slot content', () => {
    const { wrapper } = renderBaseIdToggleButton({
      scopedSlots: { default: `<span data-test="custom-slot">Custom slot</span>` }
    });

    expect(wrapper.find(getDataTestSelector('custom-slot')).text()).toEqual('Custom slot');
  });

  it('renders a custom slot using the isPanelOpen property', async () => {
    const { wrapper, emit } = renderBaseIdToggleButton({
      scopedSlots: {
        default: `
          <template #default="{ isPanelOpen }">
            <span data-test="custom-slot" v-if="isPanelOpen">Close aside</span>
            <span data-test="custom-slot" v-else>Open aside</span>
          </template>
      `
      }
    });

    expect(wrapper.find(getDataTestSelector('custom-slot')).text()).toEqual('Open aside');

    await emit('TogglePanelStateChanged');

    expect(wrapper.find(getDataTestSelector('custom-slot')).text()).toEqual('Close aside');
  });
});

interface RenderBaseIdToggleButtonOptions {
  /** Id of the panel to toggle. */
  panelId?: string;
  /** The scoped slots to render. */
  scopedSlots?: Record<string, string | AnyFunction>;
}

interface RenderBaseIdToggleButtonAPI {
  /** The wrapper for the toggle button component. */
  wrapper: Wrapper<Vue>;
  /** The panel id. */
  panelId: string;
  /** Emits the provided event. */
  emit: (event: XEvent) => Promise<void>;
  /** Clicks the button. */
  click: () => Promise<void>;
}
