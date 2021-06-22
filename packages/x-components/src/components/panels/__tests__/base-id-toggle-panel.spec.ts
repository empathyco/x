/**
 * Mounts a {@link BaseIdTogglePanel} component with the provided options and offers an API to
 * easily test it.
 *
 * @param options - The options to render the component with.
 * @returns An API to test the component.
 */
import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { getDataTestSelector, installNewXPlugin } from '../../../__tests__/utils';
import { XEvent } from '../../../wiring';
import BaseIdTogglePanel from '../base-id-toggle-panel.vue';

function mountBaseIdTogglePanel({
  panelId = 'myToggle',
  defaultSlot = `<span data-test="default-slot">Panel: ${panelId}</span>`,
  startOpen = true
}: MountBaseIdToggleOptions = {}): MountBaseIdTogglePanelAPI {
  const [, localVue] = installNewXPlugin();
  const wrapper = mount(BaseIdTogglePanel, {
    localVue,
    propsData: { panelId, startOpen },
    slots: {
      default: defaultSlot
    }
  });

  const baseTogglePanelWrapper = wrapper.findComponent(BaseIdTogglePanel);

  return {
    panelId,
    baseTogglePanelWrapper,
    async emit(event: XEvent) {
      wrapper.vm.$x.emit(event, panelId);
      await localVue.nextTick();
    }
  };
}

describe('testing BaseIdTogglePanel component', () => {
  it('opens and closes when UserClickedPanelToggleButton event is emitted', async () => {
    const { baseTogglePanelWrapper, emit } = mountBaseIdTogglePanel();
    expect(baseTogglePanelWrapper.find(getDataTestSelector('base-toggle-panel')).exists()).toBe(
      true
    );

    await emit('UserClickedPanelToggleButton');
    expect(baseTogglePanelWrapper.find(getDataTestSelector('base-toggle-panel')).exists()).toBe(
      false
    );

    await emit('UserClickedPanelToggleButton');
    expect(baseTogglePanelWrapper.find(getDataTestSelector('base-toggle-panel')).exists()).toBe(
      true
    );
  });

  it('renders the default slot correctly', () => {
    const { panelId, baseTogglePanelWrapper } = mountBaseIdTogglePanel();

    expect(baseTogglePanelWrapper.find(getDataTestSelector('default-slot')).text()).toBe(
      `Panel: ${panelId}`
    );
  });

  it('renders a custom slot correctly', () => {
    const { baseTogglePanelWrapper } = mountBaseIdTogglePanel({
      defaultSlot: `<button data-test="custom-slot">Custom slot</button>`
    });

    expect(baseTogglePanelWrapper.find(getDataTestSelector('custom-slot')).text()).toBe(
      'Custom slot'
    );
  });
});

interface MountBaseIdTogglePanelAPI {
  /** The wrapper for the panel toggle component. */
  baseTogglePanelWrapper: Wrapper<Vue>;
  /** Emits the provided event. */
  emit: (event: XEvent) => Promise<void>;
  /** The panel id. */
  panelId: string;
}

interface MountBaseIdToggleOptions {
  /** The panel id. */
  panelId?: string;
  /** The startOpen property for the initial state of the panel. */
  startOpen?: boolean;
  /** The default slot to render. */
  defaultSlot?: string;
}
