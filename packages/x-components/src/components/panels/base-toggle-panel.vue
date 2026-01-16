<template>
  <component :is="animation">
    <div v-if="open" class="x-toggle-panel" data-test="base-toggle-panel">
      <!-- @slot (Required) Default content -->
      <slot />
    </div>
  </component>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { AnimationProp } from '../../types/animation-prop'

/**
 * Simple panel that receives its open state via prop, which is responsible of rendering
 * default slot inside a configurable transition.
 *
 * @public
 */
export default defineComponent({
  props: {
    /**
     * Handles if the panel is rendered. It is used with v-if instead of v-show to get better
     * performance.
     *
     * @public
     */
    open: {
      type: Boolean,
      required: true,
    },
    /**
     * Animation component that will be used to animate the panel content.
     *
     * @public
     */
    animation: {
      type: AnimationProp,
      default: 'div',
    },
  },
})
</script>

<docs lang="mdx">
## Examples

Simple panel that receives its open state via prop, which is responsible for rendering the default slot inside a configurable transition.

### Basic usage

```vue
<template>
  <BaseTogglePanel :open="true" :animation="collapseFromTop">
    <Filters :filters="filters">
      <template #default="{ filter }">
        <p>{{ filter.label }}</p>
      </template>
    </Filters>
  </BaseTogglePanel>
</template>

<script setup>
import { BaseTogglePanel } from '@empathyco/x-components'
import { CollapseFromTop } from '@empathyco/x-components/animations'
const collapseFromTop = CollapseFromTop
const filters = [{ label: 'Color' }, { label: 'Size' }, { label: 'Brand' }]
</script>
```

### Customizing the animation

You can use any animation component for the panel transition:

```vue
<script setup>
import { CollapseFromLeft } from '@empathyco/x-components/animations'
const collapseFromLeft = CollapseFromLeft
</script>
```
</docs>
