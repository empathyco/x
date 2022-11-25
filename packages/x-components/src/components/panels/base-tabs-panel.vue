<template>
  <section v-if="getTabs().length > 0" class="x-tabs-panel" data-test="base-tabs-panel">
    <component
      :is="tabsAnimation"
      tag="ul"
      class="x-list"
      :class="tabsListClass"
      data-test="base-tabs-panel-list"
    >
      <li v-for="tab in getTabs()" :key="tab">
        <!--
          @slot Slot used to replace the whole tab.
            @binding {tab} string - The tab name.
            @binding {isSelected} boolean - Indicates if the tab is selected.
            @binding {select} function - Function to select the tab.
         -->
        <slot
          name="tab"
          v-bind="{ tab, isSelected: tabIsSelected(tab), select: () => selectTab(tab) }"
        >
          <button
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

    <component :is="contentAnimation">
      <div
        v-if="selectedTab && $scopedSlots[selectedTab]"
        :key="selectedTab"
        :class="contentClass"
        data-test="base-tabs-panel-content"
      >
        <slot :name="selectedTab" />
      </div>
    </component>
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
    dynamicPropsMixin(['activeTabClass', 'contentClass', 'tabClass', 'tabsListClass'])
  ) {
    /**
     * Animation component that will be used to animate the tabs list.
     *
     * @public
     */
    @Prop({ default: 'ul' })
    public tabsAnimation!: Vue | string;

    /**
     * Animation component that will be used to animate the selected tab content.
     *
     * @public
     */
    @Prop({ default: 'div' })
    public contentAnimation!: Vue | string;

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
      return Object.keys(this.$scopedSlots).filter(
        slotName => !['tab', 'tab-content'].includes(slotName)
      );
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

<docs lang="mdx">
## Examples

This component renders a list of tabs based on the name of the slots passed on its template. By
default, the name of each slot will be used as tab label. If an initial tab is passed by prop, the
content of its correspondent slot will displayed in a panel. Otherwise, no content will be displayed
until a tab is selected.

### Basic example

It renders a list of tabs and, when a tab is clicked, a panel with its content will be displayed.

```vue
<template>
  <BaseTabsPanel>
    <template #summer>
      <div>Summer Top Sales</div>
    </template>

    <template #fall>
      <div>Fall Top Sales</div>
    </template>

    <template #outlet>
      <div>Outlet Top Sales</div>
    </template>
  </BaseTabsPanel>
</template>

<script>
  import { BaseTabsPanel } from '@empathyco/x-components';

  export default {
    name: 'BaseTabsPanelDemo',
    components: {
      BaseTabsPanel
    }
  };
</script>
```

### Play with props

#### Define the tab to be initially opened

By default, no tab is selected so any panel is displayed. The `initialTab` prop allows to indicate
which tab should be opened at first.

```vue
<template>
  <BaseTabsPanel initialTab="summer">
    <template #summer>
      <div>Summer Top Sales</div>
    </template>

    <template #fall>
      <div>Fall Top Sales</div>
    </template>

    <template #outlet>
      <div>Outlet Top Sales</div>
    </template>
  </BaseTabsPanel>
</template>

<script>
  import { BaseTabsPanel } from '@empathyco/x-components';

  export default {
    name: 'BaseTabsPanelDemo',
    components: {
      BaseTabsPanel
    }
  };
</script>
```

#### Customizing the content with classes

- The `activeTabClass` prop can be used to add classes to the active tab button.
- The `contentClass` prop can be used to add classes to the panel.
- The `tabClass` prop can be used to add classes to the tab buttons.
- The `tabsListClass` prop can be used to add classes to the tabs list.

```vue
<template>
  <BaseTabsPanel
    activeTabClass="x-button-auxiliary"
    contentClass="x-padding--04 x-background--auxiliary"
    tabClass="x-button-ghost"
    tabsListClass="x-list--horizontal"
  >
    <template #summer>
      <div>Summer Top Sales</div>
    </template>

    <template #fall>
      <div>Fall Top Sales</div>
    </template>

    <template #outlet>
      <div>Outlet Top Sales</div>
    </template>
  </BaseTabsPanel>
</template>

<script>
  import { BaseTabsPanel } from '@empathyco/x-components';

  export default {
    name: 'BaseTabsPanelDemo',
    components: {
      BaseTabsPanel
    }
  };
</script>
```

#### Play with the animations

- The `tabsAnimation` prop can be used to animate the tabs list.
- The `contentAnimation` prop can be used to animate the selected tab content.

```vue
<template>
  <BaseTabsPanel :tabsAnimation="staggeredFadeAndSlide" :contentAnimation="staggeredFadeAndSlide">
    <template #summer>
      <div>Summer Top Sales</div>
    </template>

    <template #fall>
      <div>Fall Top Sales</div>
    </template>
  </BaseTabsPanel>
</template>

<script>
  import { BaseTabsPanel, StaggeredFadeAndSlide } from '@empathyco/x-components';

  export default {
    name: 'BaseTabsPanelDemo',
    components: {
      BaseTabsPanel
    },
    data() {
      return {
        staggeredFadeAndSlide: StaggeredFadeAndSlide
      };
    }
  };
</script>
```

### Overriding the slots

#### Customizing the tab button

By default, the component is rendering a button for each tab to be displayed. This button can be
replaced entirely through the `tab` slot.

```vue
<template>
  <BaseTabsPanel>
    <template #tab="{ tab, isSelected, select }">
      <CheckIcon v-if="isSelected" />
      This is the {{ tab }} tab.
      <button @click="select">Open tab</button>
    </template>

    <template #summer>
      <div>Summer Top Sales</div>
    </template>

    <template #fall>
      <div>Fall Top Sales</div>
    </template>

    <template #outlet>
      <div>Outlet Top Sales</div>
    </template>
  </BaseTabsPanel>
</template>

<script>
  import { BaseTabsPanel, CheckIcon } from '@empathyco/x-components';

  export default {
    name: 'BaseTabsPanelDemo',
    components: {
      BaseTabsPanel,
      CheckIcon
    }
  };
</script>
```

#### Customizing the tab button content

Alternatively to the previous example, instead of changing the whole tab button, the slot
`tab-content` offers the possibility of changing just its contents.

```vue
<template>
  <BaseTabsPanel>
    <template #tab-content="{ tab, isSelected }">
      <CheckIcon v-if="isSelected" />
      {{ tab }}
    </template>

    <template #summer>
      <div>Summer Top Sales</div>
    </template>

    <template #fall>
      <div>Fall Top Sales</div>
    </template>

    <template #outlet>
      <div>Outlet Top Sales</div>
    </template>
  </BaseTabsPanel>
</template>

<script>
  import { BaseTabsPanel, CheckIcon } from '@empathyco/x-components';

  export default {
    name: 'BaseTabsPanelDemo',
    components: {
      BaseTabsPanel,
      CheckIcon
    }
  };
</script>
```

## Events

This component emits no events.
</docs>
