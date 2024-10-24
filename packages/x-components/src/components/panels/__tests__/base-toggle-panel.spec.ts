import { mount, VueWrapper } from '@vue/test-utils';
import { nextTick } from 'vue';
import { getDataTestSelector } from '../../../__tests__/utils';
import BaseTogglePanelComponent from '../base-toggle-panel.vue';

/**
 * Function that returns a BaseTogglePanel wrapper. The animation prop is not gonna be tested
 * because is part of Vue 'component'.
 *
 * @param params - Wrapper options.
 *
 * @returns BaseTogglePanel vue-test-utils wrapper.
 */
function renderBaseTogglePanel({
  open = true,
  template = '<BaseTogglePanel :open="openTogglePanel"></BaseTogglePanel>'
}: RenderBaseTogglePanelOptions = {}): RenderBaseTogglePanelAPI {
  const wrapperContainer = mount(
    {
      components: {
        BaseTogglePanel: BaseTogglePanelComponent
      },
      template
    },
    {
      data() {
        return { openTogglePanel: open };
      }
    }
  );

  const wrapper = wrapperContainer.findComponent(BaseTogglePanelComponent);

  return {
    wrapper,
    toggleOpen() {
      (wrapperContainer.vm as unknown as TogglePanelState).openTogglePanel = !(
        wrapperContainer.vm as unknown as TogglePanelState
      ).openTogglePanel;
      return nextTick();
    }
  };
}

describe('testing BaseTogglePanel component', () => {
  it('does not render anything when open is false', () => {
    const { wrapper } = renderBaseTogglePanel({ open: false });
    expect(wrapper.find(getDataTestSelector('base-toggle-panel')).exists()).toBe(false);
  });

  it('renders the component when open is true', () => {
    const { wrapper } = renderBaseTogglePanel({ open: true });
    expect(wrapper.find(getDataTestSelector('base-toggle-panel')).exists()).toBe(true);
  });

  it("renders / doesn't render the component on open change", async () => {
    const { wrapper, toggleOpen } = renderBaseTogglePanel({ open: false });
    expect(wrapper.find(getDataTestSelector('base-toggle-panel')).exists()).toBe(false);
    await toggleOpen();
    expect(wrapper.find(getDataTestSelector('base-toggle-panel')).exists()).toBe(true);
    await toggleOpen();
    expect(wrapper.find(getDataTestSelector('base-toggle-panel')).exists()).toBe(false);
  });

  it('renders its default slot correctly', () => {
    const { wrapper } = renderBaseTogglePanel({
      open: true,
      template:
        '<BaseTogglePanel :open="openTogglePanel"><div' +
        ' data-test="slot-content"></div></BaseTogglePanel>'
    });

    expect(wrapper.find(getDataTestSelector('slot-content')).exists()).toBe(true);
  });
});

interface RenderBaseTogglePanelOptions {
  /** The BaseTogglePanel open prop. */
  open?: boolean;
  /** The template to render. Receives the `open` via prop. */
  template?: string;
}

interface RenderBaseTogglePanelAPI {
  /** The Vue testing utils wrapper for the {@link BaseTogglePanelComponent}. */
  wrapper: VueWrapper;
  /** Function that toggles panel visibility. */
  toggleOpen: () => Promise<void>;
}
interface TogglePanelState {
  openTogglePanel: boolean;
}
