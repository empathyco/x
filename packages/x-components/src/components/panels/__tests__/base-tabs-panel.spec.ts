import Vue from 'vue';
import { createLocalVue, mount, Wrapper, WrapperArray } from '@vue/test-utils';
import { getDataTestSelector } from '../../../__tests__/utils';
import BaseTabsPanel from '../base-tabs-panel.vue';

/**
 * Function that returns a BaseTabsPanel wrapper. The animation prop is not gonna be tested
 * because is part of Vue 'component'.
 *
 * @param params - Wrapper options.
 *
 * @returns BaseTabsPanel vue-test-utils wrapper.
 */
function renderBaseTabsPanel({
  scopedSlots,
  initialTab = '',
  activeTabClass
}: RenderBaseTabsPanelOptions = {}): RenderBaseTabsPanelAPI {
  const localVue = createLocalVue();

  const wrapper = mount(BaseTabsPanel, {
    localVue,
    propsData: { activeTabClass, initialTab },
    scopedSlots
  });

  return {
    wrapper,
    clickNthTab: (nth: number) => {
      wrapper.findAll(getDataTestSelector('tabs-panel-button')).at(nth).trigger('click');
      return localVue.nextTick();
    },
    getBaseTabsPanel: () => wrapper.find(getDataTestSelector('base-tabs-panel')),
    getTabs: () => wrapper.findAll(getDataTestSelector('tabs-panel-button'))
  };
}

describe('testing BaseTabsPanel', () => {
  it('does not render anything when no tabs are defined in the template', () => {
    const { getBaseTabsPanel } = renderBaseTabsPanel();

    expect(getBaseTabsPanel().exists()).toBe(false);
  });

  it('renders only the tabs list when no `initialTab` is passed', () => {
    const { wrapper, getTabs } = renderBaseTabsPanel({
      scopedSlots: {
        summer: '<div>Top Summer sales</div>',
        fall: '<div>Top Fall sales</div>',
        outlet: '<div>Top Outlet sales</div>'
      }
    });

    expect(getTabs()).toHaveLength(3);
    expect(wrapper.find(getDataTestSelector('summer-content')).exists()).toBe(false);
    expect(wrapper.find(getDataTestSelector('fall-content')).exists()).toBe(false);
    expect(wrapper.find(getDataTestSelector('outlet-content')).exists()).toBe(false);
  });

  it('renders the tab indicated by `initialTab`', () => {
    const { wrapper, getTabs } = renderBaseTabsPanel({
      scopedSlots: {
        summer: '<div>Top Summer sales</div>',
        fall: '<div>Top Fall sales</div>',
        outlet: '<div>Top Outlet sales</div>'
      },
      initialTab: 'fall'
    });

    expect(getTabs()).toHaveLength(3);
    expect(wrapper.find(getDataTestSelector('summer-panel')).exists()).toBe(false);
    expect(wrapper.find(getDataTestSelector('fall-panel')).exists()).toBe(true);
    expect(wrapper.find(getDataTestSelector('outlet-panel')).exists()).toBe(false);
    expect(wrapper.find(getDataTestSelector('fall-panel')).text()).toBe('Top Fall sales');
  });

  it('renders the default `tab` slot', () => {
    const { wrapper, getTabs } = renderBaseTabsPanel({
      scopedSlots: {
        summer: '<div>Top Summer sales</div>'
      },
      initialTab: 'summer'
    });

    expect(getTabs()).toHaveLength(1);
    expect(getTabs().at(0).text()).toBe('summer');
    expect(wrapper.find(getDataTestSelector('summer-panel')).text()).toBe('Top Summer sales');
  });

  it('renders a custom `tab` slot properly', () => {
    const { getTabs } = renderBaseTabsPanel({
      scopedSlots: {
        tab: '<button data-test="tabs-panel-button">{{ props.tab }} tab</button>',
        summer: '<div>Summer top sales</div>'
      }
    });

    expect(getTabs()).toHaveLength(1);
    expect(getTabs().at(0).text()).toBe('summer tab');
  });

  it('renders a custom `tab-content` slot properly', () => {
    const { getTabs } = renderBaseTabsPanel({
      scopedSlots: {
        'tab-content': '<template v-slot="{ tab, isSelected }">custom {{ tab }} tab</template>',
        summer: '<div>Top Summer sales</div>'
      }
    });

    expect(getTabs()).toHaveLength(1);
    expect(getTabs().at(0).text()).toBe('custom summer tab');
  });

  it('renders as many tabs as included in template', () => {
    const { wrapper, getTabs } = renderBaseTabsPanel({
      scopedSlots: {
        summer: '<div>Top Summer sales</div>',
        fall: '<div>Top Fall sales</div>',
        outlet: '<div>Top Outlet sales</div>'
      },
      initialTab: 'summer'
    });

    expect(getTabs()).toHaveLength(3);
    expect(wrapper.find(getDataTestSelector('summer-panel')).text()).toBe('Top Summer sales');
    expect(wrapper.find(getDataTestSelector('fall-panel')).exists()).toBe(false);
    expect(wrapper.find(getDataTestSelector('outlet-panel')).exists()).toBe(false);
  });

  it('changes the selected tab on click', async () => {
    const { wrapper, clickNthTab, getTabs } = renderBaseTabsPanel({
      scopedSlots: {
        summer: '<div>Top Summer sales</div>',
        fall: '<div>Top Fall sales</div>',
        outlet: '<div>Top Outlet sales</div>'
      },
      activeTabClass: 'selectedTab',
      initialTab: 'summer'
    });

    // First tab is selected initially
    expect(getTabs().at(0).element).toHaveClass('selectedTab');

    // Select third tab
    await clickNthTab(2);
    expect(getTabs().at(2).element).toHaveClass('selectedTab');

    // The third panel is the rendered one
    expect(wrapper.find(getDataTestSelector('summer-panel')).exists()).toBe(false);
    expect(wrapper.find(getDataTestSelector('fall-panel')).exists()).toBe(false);
    expect(wrapper.find(getDataTestSelector('outlet-panel')).text()).toBe('Top Outlet sales');
  });
});

interface RenderBaseTabsPanelOptions {
  /** Scoped slots to be passed to the mount function. */
  scopedSlots?: Record<string, string>;
  /** Classes to add to the active tab button. */
  activeTabClass?: string;
  /** The tab to be initially selected. */
  initialTab?: string;
}

interface RenderBaseTabsPanelAPI {
  /** The Vue testing utils wrapper for the {@link BaseTabsPanel}. */
  wrapper: Wrapper<Vue>;
  /** Clicks the nth tab button and waits for the view to update. */
  clickNthTab: (nth: number) => Promise<void>;
  /** Returns the BaseTabsPanel. */
  getBaseTabsPanel: () => Wrapper<Vue>;
  /** Returns the tabs buttons. */
  getTabs: () => WrapperArray<Vue>;
}
