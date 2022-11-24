import Vue from 'vue';
import { createLocalVue, mount, Wrapper, WrapperArray } from '@vue/test-utils';
import { getDataTestSelector } from '../../../__tests__/utils';
import BaseTabsPanel from '../base-tabs-panel.vue';

/**
 * Function that returns a BaseTabsPanel wrapper. The animation prop is not
 * tested because it is part of Vue 'component'.
 *
 * @param params - Wrapper options.
 *
 * @returns BaseTabsPanel vue-test-utils wrapper.
 */
function renderBaseTabsPanel({
  scopedSlots,
  initialTab,
  activeTabClass,
  panelClass,
  tabClass,
  tabsListClass
}: RenderBaseTabsPanelOptions = {}): RenderBaseTabsPanelAPI {
  const localVue = createLocalVue();

  const wrapper = mount(BaseTabsPanel, {
    localVue,
    propsData: { initialTab, activeTabClass, panelClass, tabClass, tabsListClass },
    scopedSlots
  });

  return {
    wrapper,
    clickNthTab: (nth: number) => {
      wrapper.findAll(getDataTestSelector('base-tabs-panel-button')).at(nth).trigger('click');
      return localVue.nextTick();
    },
    getBaseTabsPanel: () => wrapper.find(getDataTestSelector('base-tabs-panel')),
    getTabPanel: () => wrapper.find(getDataTestSelector('base-tabs-panel-content')),
    getTabsButtons: () => wrapper.findAll(getDataTestSelector('base-tabs-panel-button')),
    getTabsList: () => wrapper.find(getDataTestSelector('base-tabs-panel-list'))
  };
}

describe('testing BaseTabsPanel', () => {
  it('does not render anything when no tabs are defined in the template', () => {
    const { getBaseTabsPanel } = renderBaseTabsPanel();

    expect(getBaseTabsPanel().exists()).toBe(false);
  });

  it('renders only the tabs list when no `initialTab` is passed', () => {
    const { getTabPanel, getTabsButtons } = renderBaseTabsPanel({
      scopedSlots: {
        summer: '<div>Top Summer sales</div>',
        fall: '<div>Top Fall sales</div>',
        outlet: '<div>Top Outlet sales</div>'
      }
    });

    expect(getTabsButtons()).toHaveLength(3);
    expect(getTabPanel().exists()).toBe(false);
  });

  it('renders only the tabs list when passed `initialTab` is invalid', () => {
    const { getTabPanel, getTabsButtons } = renderBaseTabsPanel({
      scopedSlots: {
        summer: '<div>Top Summer sales</div>',
        fall: '<div>Top Fall sales</div>',
        outlet: '<div>Top Outlet sales</div>'
      },
      initialTab: 'whatever'
    });

    expect(getTabsButtons()).toHaveLength(3);
    expect(getTabPanel().exists()).toBe(false);
  });

  it('renders the panel of the tab indicated by `initialTab`', () => {
    const { getTabPanel } = renderBaseTabsPanel({
      scopedSlots: {
        summer: '<div>Top Summer sales</div>',
        fall: '<div>Top Fall sales</div>'
      },
      initialTab: 'fall'
    });

    expect(getTabPanel().text()).toBe('Top Fall sales');
  });

  it('renders the default `tab` slot', () => {
    const { getTabsButtons } = renderBaseTabsPanel({
      scopedSlots: {
        summer: '<div>Top Summer sales</div>'
      }
    });

    expect(getTabsButtons()).toHaveLength(1);
    expect(getTabsButtons().at(0).text()).toBe('summer');
  });

  it('renders a custom `tab` slot properly', async () => {
    const { clickNthTab, getTabsButtons } = renderBaseTabsPanel({
      scopedSlots: {
        tab: `<template v-slot="{ tab, isSelected, selectTab }">
            <button data-test="base-tabs-panel-button" @click="selectTab">
              custom {{ tab }} tab <span v-if="isSelected">✅</span>
            </button>
          </template>`,
        summer: '<div>Summer top sales</div>'
      }
    });

    expect(getTabsButtons()).toHaveLength(1);
    expect(getTabsButtons().at(0).text()).toBe('custom summer tab');

    // Select first tab
    await clickNthTab(0);
    expect(getTabsButtons().at(0).text()).toBe('custom summer tab ✅');
  });

  it('renders a custom `tab-content` slot properly', async () => {
    const { clickNthTab, getTabsButtons } = renderBaseTabsPanel({
      scopedSlots: {
        'tab-content': `<template v-slot="{ tab, isSelected }">
            custom {{ tab }} tab content <span v-if="isSelected">✅</span>
          </template>`,
        summer: '<div>Top Summer sales</div>'
      }
    });

    expect(getTabsButtons()).toHaveLength(1);
    expect(getTabsButtons().at(0).text()).toBe('custom summer tab content');

    // Select first tab
    await clickNthTab(0);
    expect(getTabsButtons().at(0).text()).toBe('custom summer tab content ✅');
  });

  it('changes the selected tab on click', async () => {
    const { clickNthTab, getTabPanel, getTabsButtons } = renderBaseTabsPanel({
      scopedSlots: {
        summer: '<div>Top Summer sales</div>',
        fall: '<div>Top Fall sales</div>',
        outlet: '<div>Top Outlet sales</div>'
      },
      activeTabClass: 'selected-tab',
      initialTab: 'summer'
    });

    // First tab is selected initially
    expect(getTabsButtons().at(0).element).toHaveClass('selected-tab');

    // Select third tab
    await clickNthTab(2);
    expect(getTabsButtons().at(2).element).toHaveClass('selected-tab');

    // The third panel is the rendered one
    expect(getTabPanel().text()).toBe('Top Outlet sales');
  });

  it('allows adding CSS classes to the tabs and panel', () => {
    const { getTabPanel, getTabsButtons, getTabsList } = renderBaseTabsPanel({
      scopedSlots: {
        summer: '<div>Top Summer sales</div>',
        fall: '<div>Top Fall sales</div>'
      },
      initialTab: 'summer',
      activeTabClass: 'selected-tab',
      panelClass: 'tab-panel',
      tabClass: 'tab-button',
      tabsListClass: 'tabs-list'
    });

    expect(getTabsButtons().at(0).element).toHaveClass('selected-tab');
    expect(getTabsButtons().at(1).element).toHaveClass('tab-button');
    expect(getTabPanel().element).toHaveClass('tab-panel');
    expect(getTabsList().element).toHaveClass('tabs-list');
  });
});

interface RenderBaseTabsPanelOptions {
  /** Scoped slots to be passed to the mount function. */
  scopedSlots?: Record<string, string>;
  /** The tab to be initially selected. */
  initialTab?: string;
  /** Classes to add to the active tab button. */
  activeTabClass?: string;
  /** Classes to add to the panel. */
  panelClass?: string;
  /** Classes to add to the tab buttons. */
  tabClass?: string;
  /** Classes to add to the tabs list. */
  tabsListClass?: string;
}

interface RenderBaseTabsPanelAPI {
  /** The Vue testing utils wrapper for the {@link BaseTabsPanel}. */
  wrapper: Wrapper<Vue>;
  /** Clicks the nth tab button and waits for the view to update. */
  clickNthTab: (nth: number) => Promise<void>;
  /** Returns the BaseTabsPanel. */
  getBaseTabsPanel: () => Wrapper<Vue>;
  /** Returns the selected tab panel. */
  getTabPanel: () => Wrapper<Vue>;
  /** Returns the tabs buttons. */
  getTabsButtons: () => WrapperArray<Vue>;
  /** Returns the tabs list. */
  getTabsList: () => Wrapper<Vue>;
}
