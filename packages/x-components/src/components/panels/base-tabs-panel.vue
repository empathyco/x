<template>
  <section v-if="getTabs().length > 0" class="x-tabs-panel" data-test="base-tabs-panel">
    <component
      :is="animation"
      tag="ul"
      class="x-list"
      :class="tabsListClass"
      data-test="base-tabs-panel-list"
    >
      <li v-for="tab in getTabs()" :key="tab">
        <!--
          @slot Slot that is be used for replacing the whole tab.
            @binding {tab} string - The tab name.
            @binding {isSelected} boolean - Indicates if the tab is selected.
            @binding {selectTab} {() => void} selectTab - Function to select the tab.
         -->
        <slot
          name="tab"
          v-bind="{ tab, isSelected: tabIsSelected(tab), selectTab: () => selectTab(tab) }"
        >
          <button
            :key="tab"
            @click="selectTab(tab)"
            class="x-button x-tabs-panel__button"
            :class="tabIsSelected(tab) ? activeTabClass : tabClass"
            :aria-pressed="tabIsSelected(tab)"
            data-test="base-tabs-panel-button"
          >
            <!--
              @slot Slot used to just pass the content.
                @binding {tab} string - The tab name.
                @binding {isSelected} boolean - Indicates if the tab is selected.
            -->
            <slot name="tab-content" v-bind="{ tab, isSelected: tabIsSelected(tab) }">
              {{ tab }}
            </slot>
          </button>
        </slot>
      </li>
    </component>

    <template v-for="(_, slotName) in $scopedSlots">
      <div
        v-if="slotName === selectedTab"
        :key="slotName"
        :class="panelClass"
        :data-test="`base-tabs-panel-${slotName}`"
      >
        <slot :name="slotName" />
      </div>
    </template>
  </section>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { mixins } from 'vue-class-component';
  import { Component, Prop } from 'vue-property-decorator';
  import { dynamicPropsMixin } from '../dynamic-props.mixin';

  /**
   * Base Tabs Panel.
   *
   * @public
   */
  @Component
  export default class BaseTabsPanel extends mixins(
    dynamicPropsMixin(['activeTabClass', 'panelClass', 'tabClass', 'tabsListClass'])
  ) {
    /**
     * Animation component that will be used to animate the tabs list.
     *
     * @public
     */
    @Prop({ default: 'ul' })
    public animation!: Vue | string;

    /**
     * The tab to be initially selected.
     *
     * @public
     */
    @Prop({ default: '' })
    public initialTab!: string;

    /**
     * The currently selected tab.
     *
     * @internal
     */
    protected selectedTab: string = this.initialTab;

    /**
     * Extracts the tab from the slots.
     *
     * @returns The list of tabs.
     *
     * @internal
     */
    protected getTabs(): string[] {
      return Object.keys(this.$scopedSlots).filter(tab => tab !== 'tab-content' && tab !== 'tab');
    }

    /**
     * Changes the current selected tab.
     *
     * @param tab - The tab to be selected.
     *
     * @internal
     */
    protected selectTab(tab: string): void {
      this.selectedTab = tab;
    }

    /**
     * Checks if a tab is selected.
     *
     * @param tab - Tab to check.
     * @returns True if the tab is selected, false otherwise.
     *
     * @internal
     */
    protected tabIsSelected(tab: string): boolean {
      return this.selectedTab === tab;
    }
  }
</script>
