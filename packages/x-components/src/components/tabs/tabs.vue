<template>
  <nav class="xds:tabs" data-test="tabs" :aria-label="ariaLabels?.root" role="tablist">
    <Tab
      v-for="item in items"
      :key="item.id"
      :label="item.label"
      :selected="item.selected"
      :click="() => selectItem(item)"
      :class="itemClasses"
    />
  </nav>
</template>

<script lang="ts">
import type { PropType } from 'vue'
import type { TabItem } from './tab.types'
import { useAccessibilityLabels } from '@x/composables'
import { defineComponent } from 'vue'
import Tab from './tab.vue'

/**
 * Renders a list of tabs from the given `items`. It keeps track of the
 * selected tab internally: clicking a tab marks it as selected and invokes
 * its `click` callback.
 *
 * @public
 */
export default defineComponent({
  name: 'Tabs',
  components: { Tab },
  props: {
    /**
     * The tabs to render.
     *
     * @public
     */
    items: {
      type: Array as PropType<TabItem[]>,
      required: true,
    },
    /**
     * The classes for tab item.
     *
     * @public
     */
    itemClasses: String,
  },
  setup() {
    const ariaLabels = useAccessibilityLabels('tabs')

    /**
     * Marks the given item as selected and invokes its `click` callback.
     */
    const selectItem = (item: TabItem): void => {
      item.click()
    }

    return {
      ariaLabels,
      selectItem,
    }
  },
})
</script>

<docs lang="mdx">
## Usage

`Tabs` renders a list of tabs from the `items` array. Each item needs an `id`,
a `label` and a `click` callback. The component keeps track of the selected
tab internally, so you don't need to manage the selection state:

```vue
<template>
  <Tabs :items="tabs" />
</template>

<script>
import { Tabs } from '@empathyco/x-components'

export default {
  name: 'TabsDemo',
  components: { Tabs },
  data() {
    return {
      tabs: [
        { id: 'all', label: 'All', click: () => console.log('All clicked') },
        { id: 'brands', label: 'Brands', click: () => console.log('Brands clicked') },
      ],
    }
  },
}
</script>
```
</docs>
