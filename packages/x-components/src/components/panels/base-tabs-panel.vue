<template>
  <section v-if="getTabs().length > 0" class="x-tabs-panel" data-test="base-tabs-panel">
    <component
      :is="tabsAnimation"
      class="x-tabs-panel__items-list x-list"
      :class="tabsListClass"
      data-test="base-tabs-panel-list"
      role="tablist"
    >
      <!--
        @slot Slot used to replace the whole tab.
          @binding {string} tab - The tab name.
          @binding {boolean} isSelected - Indicates if the tab is selected.
          @binding {function} select - Function to select the tab.
      -->
      <slot
        v-for="tab in getTabs()"
        name="tab"
        v-bind="{ tab, isSelected: tabIsSelected(tab), select: () => selectTab(tab) }"
      >
        <button
          :key="tab"
          @click="selectTab(tab)"
          :id="`base-tabs-panel-${tab}`"
          class="x-tabs-panel__list-item x-tabs-panel__button x-button"
          :class="tabIsSelected(tab) ? activeTabClass : tabClass"
          :aria-selected="tabIsSelected(tab)"
          data-test="base-tabs-panel-button"
          role="tab"
        >
          <!--
              @slot Slot used to just pass the content.
                @binding {string} tab - The tab name.
                @binding {boolean} isSelected - Indicates if the tab is selected.
            -->
          <slot name="tab-content" v-bind="{ tab, isSelected: tabIsSelected(tab) }">
            {{ tab }}
          </slot>
        </button>
      </slot>
    </component>

    <component :is="contentAnimation">
      <div
        v-if="selectedTab && $scopedSlots[selectedTab]"
        :key="selectedTab"
        :class="contentClass"
        :aria-labelledby="`base-tabs-panel-${selectedTab}`"
        data-test="base-tabs-panel-content"
        role="tabpanel"
      >
        <!--
          @slot Slot used to display the selected tab content.
            @binding {string} tab - This content's tab name.
            @binding {function} selectTab - Function to select a tab.
            @binding {function} deselectTab - Function to deselect the tab.
        -->
        <slot
          :name="selectedTab"
          v-bind="{ tab: selectedTab, selectTab, deselectTab: () => selectTab(selectedTab) }"
        />
      </div>
    </component>
  </section>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { mixins } from 'vue-class-component';
  import { Component, Prop } from 'vue-property-decorator';
  import { NoElement } from '../no-element';
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
    @Prop({ default: 'header' })
    public tabsAnimation!: Vue | string;

    /**
     * Animation component that will be used to animate the selected tab content.
     *
     * @public
     */
    @Prop({ default: () => NoElement })
    public contentAnimation!: Vue | string;

    /**
     * The tab to be initially selected.
     *
     * @public
     */
    @Prop({ default: '' })
    public initialTab!: string;

    /**
     * Allows the tabs to be unselected.
     *
     * @public
     */
    @Prop({ default: false, type: Boolean })
    public allowTabDeselect!: boolean;

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
     * Changes the current selected tab. If the tab is already selected
     * and `allowTabDeselect` is `true`, the tab will be unselected.
     *
     * @param tab - The tab to be selected.
     *
     * @internal
     */
    protected selectTab(tab: string): void {
      if (this.allowTabDeselect && this.selectedTab === tab) {
        this.selectedTab = '';
      } else {
        this.selectedTab = tab;
      }
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

#### Allowing tabs deselection

The prop `allowTabDeselect` allows the tabs to be deselected. When a tab that is already selected is
clicked again, the tab will be deselected and no panel content will be displayed. By default, this
behavior is disabled.

```vue
<template>
  <BaseTabsPanel initialTab="summer" allowTabDeselect>
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
- The `contentClass` prop can be used to add classes to the content.
- The `tabClass` prop can be used to add classes to the tab buttons.
- The `tabsListClass` prop can be used to add classes to the tabs list.

```vue
<template>
  <BaseTabsPanel
    activeTabClass="x-button-auxiliary"
    contentClass="x-padding--04 x-background--auxiliary"
    tabClass="x-button-ghost"
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

#### Customizing the tab panel content

The displayed tab name and a method to select a tab are exposed to the tab panel content slot.

```vue
<template>
  <BaseTabsPanel>
    <template #summer="{ tab, selectTab, deselectTab }">
      <h1>{{ tab }}</h1>
      <button @click="() => selectTab('fall')">Open Fall</button>
      <button @click="deselectTab">Close tab</button>
    </template>

    <template #fall>
      <div>Fall Top Sales</div>
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

## Events

This component emits no events.
</docs>
