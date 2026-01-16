<template>
  <div class="x-header-toggle-panel">
    <!-- @slot (Required) Slot that is be used for replacing the whole header. -->
    <slot name="header" v-bind="{ toggleOpen, open }">
      <!-- header-toggle-panel__header -->
      <button
        class="x-header-toggle-panel__header"
        :class="headerClass"
        data-test="toggle-panel-header"
        @click="toggleOpen"
      >
        <!-- @slot (Required) Slot used to just pass the content. -->
        <slot name="header-content" v-bind="{ open }"></slot>
      </button>
    </slot>

    <BaseTogglePanel :open="open" :animation="animation">
      <!-- @slot (Required) Default content. -->
      <slot />
    </BaseTogglePanel>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { AnimationProp } from '../../types'
import { NoAnimation } from '../animations'
import BaseTogglePanel from './base-toggle-panel.vue'

/**
 * Toggle panel which uses the base toggle panel, adds a header and manage the
 * open / close state of the panel.
 *
 * @public
 */
export default defineComponent({
  name: 'BaseHeaderTogglePanel',
  components: { BaseTogglePanel },
  props: {
    /** Animation component that will be used to animate the base-toggle-panel. */
    animation: {
      type: AnimationProp,
      default: () => NoAnimation,
    },
    /** Handles if the panel is open by default. */
    startCollapsed: Boolean,
    /** Class inherited by content element. */
    headerClass: String,
  },
  setup(props, { emit }) {
    /**
     * Handles if the base panel is open or closed.
     *
     * @internal
     */
    const open = ref(!props.startCollapsed)

    /**
     * Emits open status event.
     *
     * @internal
     */
    const emitOpenStatusEvent = () => {
      emit(open.value ? 'open' : 'close')
    }

    /**
     * Toggles the open property.
     *
     * @internal
     */
    const toggleOpen = () => {
      open.value = !open.value
      emitOpenStatusEvent()
    }

    return {
      open,
      toggleOpen,
    }
  },
})
</script>

<style lang="css" scoped>
.x-header-toggle-panel__header {
  cursor: pointer;
}
</style>

<docs lang="mdx">
## Events

A list of events that the component will emit:

- `open`: emitted after the user clicks the element and opens it.
- `close`: emitted after the user clicks the element and closes it.

## Examples

Toggle panel which uses the base toggle panel, adds a header and manages the open/close state of the panel.

### Basic usage

```vue
<template>
  <BaseHeaderTogglePanel :animation="collapseHeight" :start-collapsed="false">
    <template #header-content="{ open }">
      <p>Header, open: {{ open ? 'close' : 'open' }}</p>
    </template>
    <template #default>
      <p>Default content</p>
    </template>
  </BaseHeaderTogglePanel>
</template>

<script setup>
import { BaseHeaderTogglePanel } from '@empathyco/x-components'
import { CollapseHeight } from '@empathyco/x-components/animations'
const collapseHeight = CollapseHeight
</script>
```

### Custom header

```vue
<template>
  <BaseHeaderTogglePanel :animation="collapseHeight" :start-collapsed="true">
    <template #header="{ toggleOpen, open }">
      <p>Header, open: {{ open ? 'close' : 'open' }}</p>
      <button @click="toggleOpen">Toggle</button>
    </template>
    <template #default>
      <p>Default content</p>
    </template>
  </BaseHeaderTogglePanel>
</template>

<script setup>
import { BaseHeaderTogglePanel } from '@empathyco/x-components'
import { CollapseHeight } from '@empathyco/x-components/animations'
const collapseHeight = CollapseHeight
</script>
```

### Customizing default header with classes

The `headerClass` prop can be used to add classes to the header of the toggle panel.

```vue
<template>
  <BaseHeaderTogglePanel
    headerClass="custom-class"
    :animation="collapseHeight"
    :start-collapsed="false"
  >
    <template #header-content="{ open }">
      <p>Header, open: {{ open ? 'close' : 'open' }}</p>
    </template>
    <template #default>
      <p>Default content</p>
    </template>
  </BaseHeaderTogglePanel>
</template>

<script setup>
import { BaseHeaderTogglePanel } from '@empathyco/x-components'
import { CollapseHeight } from '@empathyco/x-components/animations'
const collapseHeight = CollapseHeight
</script>
```
</docs>
