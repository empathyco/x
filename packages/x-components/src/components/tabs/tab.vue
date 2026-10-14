<template>
  <button
    type="button"
    class="xds:tab"
    :class="{ 'xds:selected': selected }"
    data-test="tab"
    role="tab"
    :aria-selected="selected"
    @click="handleClick"
  >
    <slot>{{ label }}</slot>
  </button>
</template>

<script lang="ts">
import type { PropType } from 'vue'
import { defineComponent } from 'vue'

/**
 * Generic tab. It renders a button with the given
 * `label`, invokes the `click` callback on user interaction and reflects
 * the `selected` state through the `x-tab--is-selected` modifier
 * class.
 *
 * @public
 */
export default defineComponent({
  name: 'SearchTab',
  props: {
    /**
     * Text label rendered inside the tab. It can be replaced by the
     * default slot.
     *
     * @public
     */
    label: {
      type: String,
      default: '',
    },
    /**
     * Callback invoked when the tab is clicked.
     *
     * @public
     */
    click: {
      type: Function as PropType<() => void>,
      default: () => undefined,
    },
    /**
     * Indicates whether the tab is currently selected.
     *
     * @public
     */
    selected: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    /**
     * Invokes the `click` callback prop.
     */
    const handleClick = (): void => {
      props.click?.()
    }

    return {
      handleClick,
    }
  },
})
</script>

<docs lang="mdx">
## Usage

`SearchTab` is a generic tab for search layouts. It receives a `label`, a `click`
callback and a `selected` flag:

```vue live
<template>
  <div class="x-flex x-gap-4">
    <SearchTab label="All" :selected="selectedTab === 'all'" :click="() => (selectedTab = 'all')" />
    <SearchTab
      label="Brands"
      :selected="selectedTab === 'brands'"
      :click="() => (selectedTab = 'brands')"
    />
  </div>
</template>

<script>
import { Tab } from '@empathyco/x-components'

export default {
  name: 'TabDemo',
  components: { Tab },
  data() {
    return {
      selectedTab: 'all',
    }
  },
}
</script>
```

### Customise the content

The default slot replaces the `label` content entirely:

```vue live
<template>
  <Tab label="Custom" selected>
    <span class="x-text-accent-50">Custom content</span>
  </Tab>
</template>

<script>
import { Tab } from '@empathyco/x-components'

export default {
  name: 'TabDemo',
  components: { Tab },
}
</script>
```
</docs>
