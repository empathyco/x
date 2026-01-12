<template>
  <section v-if="getTabs().length > 0" class="x-tabs-panel" data-test="base-tabs-panel">
    <component
      :is="tabsAnimation"
      class="x-tabs-panel__items-list"
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
          :id="`base-tabs-panel-${tab}`"
          :key="tab"
          class="x-tabs-panel__list-item x-tabs-panel__button xds:button"
          :class="tabIsSelected(tab) ? activeTabClass : tabClass"
          :aria-selected="tabIsSelected(tab).toString()"
          data-test="base-tabs-panel-button"
          role="tab"
          @click="selectTab(tab)"
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
        v-if="selectedTab && slots[selectedTab]"
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
import { defineComponent, ref } from 'vue'
import { AnimationProp } from '../../types'
import { NoAnimation } from '../animations'

/**
 * Base Tabs Panel.
 *
 * @public
 */
export default defineComponent({
  name: 'BaseTabsPanel',
  props: {
    /**
     * Animation component that will be used to animate the tabs list.
     *
     * @public
     */
    tabsAnimation: {
      type: AnimationProp,
      default: 'header',
    },
    /**
     * Animation component that will be used to animate the selected tab content.
     *
     * @public
     */
    contentAnimation: {
      type: AnimationProp,
      default: () => NoAnimation,
    },
    /**
     * The tab to be initially selected.
     *
     * @public
     */
    initialTab: {
      type: String,
      default: '',
    },
    /**
     * Allows the tabs to be unselected.
     *
     * @public
     */
    allowTabDeselect: {
      type: Boolean,
      default: false,
    },
    /** Class inherited by content element. */
    activeTabClass: String,
    /** Class inherited by content element. */
    contentClass: String,
    /** Class inherited by content element. */
    tabClass: String,
    /** Class inherited by content element. */
    tabsListClass: String,
  },
  setup(props, { slots }) {
    /**
     * The currently selected tab.
     *
     * @internal
     */
    const selectedTab = ref(props.initialTab)

    /**
     * Extracts the tab from the slots.
     *
     * @returns The list of tabs.
     *
     * @internal
     */
    const getTabs = () =>
      Object.keys(slots).filter(slotName => !['tab', 'tab-content'].includes(slotName))

    /**
     * Changes the current selected tab. If the tab is already selected
     * and `allowTabDeselect` is `true`, the tab will be unselected.
     *
     * @param tab - The tab to be selected.
     *
     * @internal
     */
    const selectTab = (tab: string) => {
      if (props.allowTabDeselect && selectedTab.value === tab) {
        selectedTab.value = ''
      } else {
        selectedTab.value = tab
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
    const tabIsSelected = (tab: string) => selectedTab.value === tab

    return {
      selectedTab,
      slots,
      getTabs,
      selectTab,
      tabIsSelected,
    }
  },
})
</script>

<style lang="css" scoped>
.x-tabs-panel__items-list {
  display: flex;
}
</style>

<docs lang="mdx">
## Events

This component emits no events.

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
import { BaseTabsPanel } from '@empathyco/x-components'

export default {
  name: 'BaseTabsPanelDemo',
  components: {
    BaseTabsPanel,
  },
}
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
import { BaseTabsPanel } from '@empathyco/x-components'

export default {
  name: 'BaseTabsPanelDemo',
  components: {
    BaseTabsPanel,
  },
}
</script>
```

#### Allowing tabs deselection

The prop `allowTabDeselect` allows the tabs to be deselected. When a tab that is already selected is
clicked again, the tab will be deselected and no panel content will be displayed. By default, this
behavior is deactivated.

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
import { BaseTabsPanel } from '@empathyco/x-components'

export default {
  name: 'BaseTabsPanelDemo',
  components: {
    BaseTabsPanel,
  },
}
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
    activeTabClass="xds:button-auxiliary"
    contentClass="x-p-12 x-bg-auxiliary-25"
    tabClass="xds:button-ghost"
    tabListClass="x-flex-col"
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
import { BaseTabsPanel } from '@empathyco/x-components'

export default {
  name: 'BaseTabsPanelDemo',
  components: {
    BaseTabsPanel,
  },
}
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
import { BaseTabsPanel, StaggeredFadeAndSlide } from '@empathyco/x-components'

export default {
  name: 'BaseTabsPanelDemo',
  components: {
    BaseTabsPanel,
  },
  data() {
    return {
      staggeredFadeAndSlide: StaggeredFadeAndSlide,
    }
  },
}
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
import { BaseTabsPanel, CheckIcon } from '@empathyco/x-components'

export default {
  name: 'BaseTabsPanelDemo',
  components: {
    BaseTabsPanel,
    CheckIcon,
  },
}
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
import { BaseTabsPanel, CheckIcon } from '@empathyco/x-components'

export default {
  name: 'BaseTabsPanelDemo',
  components: {
    BaseTabsPanel,
    CheckIcon,
  },
}
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
import { BaseTabsPanel } from '@empathyco/x-components'

export default {
  name: 'BaseTabsPanelDemo',
  components: {
    BaseTabsPanel,
  },
}
</script>
```
</docs>
