<template>
  <component :is="animation">
    <div v-if="open" class="x-toggle-panel" data-test="base-toggle-panel">
      <!-- @slot (Required) Default content -->
      <slot />
    </div>
  </component>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';

  /**
   * Simple panel that receives its open state via prop, which is responsible of rendering
   * default slot inside a configurable transition.
   *
   * @public
   */
  @Component
  export default class BaseTogglePanel extends Vue {
    /**
     * Handles if the panel is rendered. It is used with v-if instead of v-show to get better
     * performance.
     *
     * @public
     */
    @Prop({ required: true })
    protected open!: boolean;

    /**
     * Animation component that will be used to animate the panel content.
     *
     * @public
     */
    @Prop({ default: 'div' })
    protected animation!: Vue | string;
  }
</script>

<docs>
#Example

Simple panel that receives its open state via prop, which is responsible of rendering default slot
inside a configurable transition.

## Basic usage

Using default slot:
```vue
<BaseTogglePanel :open="true" :animation="collapseFromTop">
  <BaseFilters :filters="filters">
    <template #default="{ filter }">
      <p>{{ filter.title }}</p>
    </template>
  </BaseFilters>
</BaseTogglePanel>
```
</docs>
