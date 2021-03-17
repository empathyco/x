import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { getDataTestSelector } from '../../../__tests__/utils';
import BaseHeaderTogglePanelComponent from '../base-header-toggle-panel.vue';

/**
 * Function that returns a BaseHeaderTogglePanel wrapper. The animation prop is not gonna be tested
 * because is part of BaseTogglePanel component'.
 *
 * @param params - Wrapper options.
 *
 * @returns BaseHeaderTogglePanel vue-test-utils wrapper.
 */
function renderBaseHeaderTogglePanel({
  template = '<BaseHeaderTogglePanel></BaseHeaderTogglePanel>'
}: RenderBaseTogglePanelOptions = {}): RenderBaseHeaderTogglePanelAPI {
  const wrapperContainer = mount({
    components: {
      BaseHeaderTogglePanel: BaseHeaderTogglePanelComponent
    },
    template
  });

  const wrapper = wrapperContainer.findComponent(BaseHeaderTogglePanelComponent);
  const headerWrapper = wrapper.find(getDataTestSelector('toggle-panel-header'));

  return {
    wrapper,
    toggleOpen() {
      headerWrapper.trigger('click');
      return wrapper.vm.$nextTick();
    }
  };
}

describe('testing BaseHeaderTogglePanel component', () => {
  it("doesn't render default slot at the start when startCollapsed is true", () => {
    const { wrapper } = renderBaseHeaderTogglePanel({
      template: `
        <BaseHeaderTogglePanel :start-collapsed="true">
          <p>Default slot</p>
        </BaseHeaderTogglePanel>
      `
    });

    expect(wrapper.find(getDataTestSelector('base-toggle-panel')).exists()).toBe(false);
  });

  it('renders default slot at the start when startCollapsed is true', () => {
    const { wrapper } = renderBaseHeaderTogglePanel({
      template: `
        <BaseHeaderTogglePanel :start-collapsed="false">
          <p>Default slot</p>
        </BaseHeaderTogglePanel>
      `
    });

    const togglePanelWrapper = wrapper.find(getDataTestSelector('base-toggle-panel'));
    expect(togglePanelWrapper.exists()).toBe(true);
    expect(togglePanelWrapper.text()).toBe('Default slot');
  });

  it('emits its open status as an event on header click', async () => {
    const { wrapper, toggleOpen } = renderBaseHeaderTogglePanel();
    await toggleOpen();
    expect(wrapper.emitted().close).toHaveLength(1);
    await toggleOpen();
    expect(wrapper.emitted().open).toHaveLength(1);
  });

  it('renders header slot correctly', async () => {
    const { wrapper } = renderBaseHeaderTogglePanel({
      template: `
        <BaseHeaderTogglePanel :start-collapsed="false">
          <template #header="{ toggleOpen, open }">
            <p data-test="toggle-status">{{ open ? "open" : "closed" }}</p>
            <button @click="toggleOpen" data-test="toggle-button"></button>
          </template>
          <p>Default slot</p>
        </BaseHeaderTogglePanel>
      `
    });

    // open
    expect(wrapper.find(getDataTestSelector('base-toggle-panel')).exists()).toBe(true);
    expect(wrapper.find(getDataTestSelector('base-toggle-panel')).text()).toBe('Default slot');
    expect(wrapper.find(getDataTestSelector('toggle-status')).text()).toBe('open');

    await wrapper.find(getDataTestSelector('toggle-button')).trigger('click');

    // closed
    expect(wrapper.find(getDataTestSelector('toggle-status')).text()).toBe('closed');
    expect(wrapper.find(getDataTestSelector('base-toggle-panel')).exists()).toBe(false);
  });

  it('renders header-content slot correctly', async () => {
    const { wrapper, toggleOpen } = renderBaseHeaderTogglePanel({
      template: `
        <BaseHeaderTogglePanel :start-collaps="false">
          <template #header-content="{ open }">
            <p data-test="header-content">{{ open ? "open" : "closed" }}</p> 
          </template>
          <p>Default slot</p>
        </BaseHeaderTogglePanel>
      `
    });

    const headerWrapper = wrapper.find(getDataTestSelector('header-content'));
    expect(headerWrapper.text()).toBe('open');
    await toggleOpen();
    expect(headerWrapper.text()).toBe('closed');
  });
});

interface RenderBaseTogglePanelOptions {
  /** The template to render. Receives the `open` via prop. */
  template?: string;
}

interface RenderBaseHeaderTogglePanelAPI {
  /** The Vue testing utils wrapper for the {@link BaseHeaderTogglePanelComponent}. */
  wrapper: Wrapper<Vue>;
  /** Function that toggles panel visibility. */
  toggleOpen: () => Promise<void>;
}
