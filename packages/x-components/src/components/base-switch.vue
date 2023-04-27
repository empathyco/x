<template>
  <button
    @click="toggle"
    :aria-checked="value.toString()"
    :class="cssClasses"
    class="x-switch"
    role="switch"
  >
    <div class="x-switch__handle" />
  </button>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { VueCSSClasses } from '../utils/types';

  /**
   * Basic switch component to handle boolean values. This component receives
   * its selected state using a prop, and emits a Vue event whenever the user
   * clicks it.
   *
   * @public
   */
  @Component({
    model: {
      event: 'change'
    }
  })
  export default class BaseSwitch extends Vue {
    /**
     * The selected value of the switch.
     *
     * @public
     */
    @Prop({ required: true })
    public value!: boolean;

    /**
     * Dynamic CSS classes to add to the switch component
     * depending on its internal state.
     *
     * @returns A boolean dictionary with dynamic CSS classes.
     * @internal
     */
    protected get cssClasses(): VueCSSClasses {
      return {
        'x-switch--is-selected x-selected': this.value
      };
    }

    /**
     * Emits a change event with the desired value of the switch.
     *
     * @internal
     */
    protected toggle(): void {
      this.$emit('change', !this.value);
    }
  }
</script>

<style lang="scss" scoped>
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

    &__handle {
      background: #ffffff;
      border-radius: 50%;
      height: var(--x-switch-handle-size);
      width: var(--x-switch-handle-size);
      transition: 0.25s ease-out transform;
      transform: translateX(var(--x-switch-translate-x, 0%));
    }

    &--is-selected {
      --x-switch-translate-x: calc(var(--x-switch-padding) + var(--x-switch-width) / 2);
      --x-switch-background: #1a1a1a;
    }

    &--sm {
      --x-switch-height: 12px;
    }

    &--lg {
      --x-switch-height: 24px;
    }
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
  <BaseSwitch @change="value = !value" :value="value" />
</template>

<script>
  import { BaseSwitch } from '@empathyco/x-components';

  export default {
    name: 'BaseSwitchDemo',
    components: {
      BaseSwitch
    },
    data() {
      return {
        value: false
      };
    }
  };
</script>
```

The switch component also supports using the `v-model` directive, to automatically handle its state
change:

```vue live
<template>
  <BaseSwitch v-model="value" />
</template>

<script>
  import { BaseSwitch } from '@empathyco/x-components';

  export default {
    name: 'BaseSwitchDemo',
    components: {
      BaseSwitch
    },
    data() {
      return {
        value: false
      };
    }
  };
</script>
```
</docs>
