<template>
  <button
    :aria-checked="modelValue || undefined"
    :class="cssClasses"
    class="x-switch"
    role="switch"
    @click="toggle"
  >
    <div class="x-switch__handle" />
  </button>
</template>

<script lang="ts">
import type { VueCSSClasses } from '../utils/types'
import { computed, defineComponent } from 'vue'

/**
 * Basic switch component to handle boolean values. This component receives
 * its selected state using a prop, and emits a Vue event whenever the user
 * clicks it.
 *
 * @public
 */

export default defineComponent({
  name: 'BaseSwitch',
  /**
   * The selected value of the switch.
   *
   * @public
   */
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    /**
     * Dynamic CSS classes to add to the switch component
     * depending on its internal state.
     *
     * @returns A boolean dictionary with dynamic CSS classes.
     * @internal
     */
    const cssClasses = computed<VueCSSClasses>(() => ({
      'x-switch--is-selected xds:selected': props.modelValue,
    }))

    /**
     * Emits an event with the new value of the switch.
     *
     * @internal
     */
    const toggle = (): void => {
      const newValue = !props.modelValue
      emit('update:modelValue', newValue)
    }

    return {
      cssClasses,
      toggle,
    }
  },
})
</script>

<style lang="css" scoped>
.x-switch {
  --x-switch-height: 16px;
  --x-switch-width: calc(2 * (var(--x-switch-height)) + 2 * var(--x-switch-padding));
  --x-switch-background: #b3b3b3;
  --x-switch-padding: 2px;
  --x-switch-handle-size: var(--x-switch-height);
  box-sizing: content-box;
  height: var(--x-switch-height);
  padding: var(--x-switch-padding);
  border-radius: 99999px;
  background: var(--x-switch-background);
  width: var(--x-switch-width);
  border: none;
  transition: 0.25s ease-out background-color;
  cursor: pointer;
}

.x-switch__handle {
  background: #ffffff;
  border-radius: 50%;
  height: var(--x-switch-handle-size);
  width: var(--x-switch-handle-size);
  transition: 0.25s ease-out transform;
  transform: translateX(var(--x-switch-translate-x, 0%));
}

.x-switch--is-selected {
  --x-switch-translate-x: calc(var(--x-switch-padding) + var(--x-switch-width) / 2);
  --x-switch-background: #1a1a1a;
}

.x-switch--sm {
  --x-switch-height: 12px;
}

.x-switch--lg {
  --x-switch-height: 24px;
}
</style>

<docs lang="mdx">
## Events

This component emits no events.

## See it in action

Here you have a basic example of how the switch is rendered.

_Try clicking it to see how it changes its state_

```vue live
<template>
  <BaseSwitch @update:modelValue="value = !value" :modelValue="value" />
</template>

<script>
import { BaseSwitch } from '@empathyco/x-components'

export default {
  name: 'BaseSwitchDemo',
  components: {
    BaseSwitch,
  },
  data() {
    return {
      value: false,
    }
  },
}
</script>
```

The switch component also supports using the `v-model` directive, to automatically handle its state
change:

```vue live
<template>
  <BaseSwitch v-model="value" />
</template>

<script>
import { BaseSwitch } from '@empathyco/x-components'

export default {
  name: 'BaseSwitchDemo',
  components: {
    BaseSwitch,
  },
  data() {
    return {
      value: false,
    }
  },
}
</script>
```
</docs>
