<template>
  <section class="x-tabs-panel" data-test="base-tabs-panel">
    <ul class="x-list" :class="tabsListClass">
      <li v-for="(name, index) in slotNames" :key="name">
        <!-- @slot (Required) Slot that is be used for replacing the whole tab. -->
        <slot name="tab" v-bind="{ index, name, isSelected: selectedTab === name, selectTab }">
          <button
            :key="name"
            @click="selectTab(name)"
            class="x-button x-tabs-panel__button"
            :class="selectedTab === name ? `${tabClass} ${activeTabClass}` : tabClass"
            :aria-pressed="selectedTab === name"
            data-test="tabs-panel-button"
          >
            <!-- @slot (Required) Slot used to just pass the content. -->
            <slot
              name="tab-content"
              v-bind="{ index, name, isSelected: selectedTab === name, selectTab }"
            >
              {{ name }}
            </slot>
          </button>
        </slot>
      </li>
    </ul>

    <template v-for="(_, slotName) in $scopedSlots">
      <div v-if="slotName === selectedTab" :key="slotName">
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
   * Tabs panel.
   *
   * @public
   */
  @Component
  export default class BaseTabsPanel extends mixins(
    dynamicPropsMixin(['activeTabClass', 'tabClass', 'tabsListClass'])
  ) {
    /**
     * Animation component that will be used to animate the panel content.
     *
     * @public
     */
    @Prop({ default: 'div' })
    protected animation!: Vue | string;

    @Prop({ default: '' })
    protected initialTab!: string;

    protected selectedTab: string = this.initialTab;

    protected get slotNames(): string[] {
      return Object.keys(this.$scopedSlots).filter(name => name !== 'tab-content');
    }

    protected selectTab(name: string): void {
      this.selectedTab = name;
    }
  }
</script>
