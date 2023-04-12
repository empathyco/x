<template>
  <component :is="animation">
    <div v-if="open" class="x-toggle-panel" data-test="base-toggle-panel">
      <!-- @slot (Required) Default content -->
      <slot />
    </div>
  </component>
</template>

<script lang="ts">
  import Vue, { defineComponent } from 'vue';
  import { Component, Prop } from 'vue-property-decorator';

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
        required: true
      },
      /**
       * Animation component that will be used to animate the panel content.
       *
       * @public
       */
      animation: {
        type: [Vue, String],
        default: 'div'
      }
    }
  });
</script>

<docs lang="mdx">
## Examples

Simple panel that receives its open state via prop, which is responsible of rendering default slot
inside a configurable transition.

### Basic usage

Using default slot:

```vue
<BaseTogglePanel :open="true" :animation="collapseFromTop">
  <Filters :filters="filters">
    <template #default="{ filter }">
      <p>{{ filter.label }}</p>
    </template>
  </Filters>
</BaseTogglePanel>
```
</docs>
