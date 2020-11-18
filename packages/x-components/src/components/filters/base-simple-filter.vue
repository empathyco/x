<template>
  <BaseFilter
    v-slot="{ filter: slotFilter }"
    class="x-simple-filter"
    :filter="filter"
    :filterClickedEvents="events"
    :class="cssClasses"
  >
    <!--
        @slot The content to render inside the button
            @binding {Filter} filter - The filter data
      -->
    <slot :filter="slotFilter" />
  </BaseFilter>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import BaseFilter from './base-filter.vue';
  import { SimpleFilter } from '@empathy/search-types';
  import { VueCSSClasses } from '../../utils/types';
  import { XEventsTypes } from '../../wiring/events.types';

  /**
   * Renders a simple filter, emitting the needed events when clicked.
   *
   * @public
   */
  @Component({
    components: { BaseFilter }
  })
  export default class BaseSimpleFilter extends Vue {
    /** The filter data to render. */
    @Prop({ required: true })
    public filter!: SimpleFilter;

    /**
     * Additional events to emit when the filter is clicked.
     *
     * @returns A dictionary with the events to be emitted when the filter is clicked, and its
     * payload.
     * @internal
     */
    protected get filterClickedEvents(): Partial<XEventsTypes> {
      return {
        UserClickedASimpleFilter: this.filter
      };
    }

    /**
     * Dynamic CSS classes to apply to the component.
     *
     * @returns The dynamic CSS classes to apply to the component.
     * @internal
     */
    protected get cssClasses(): VueCSSClasses {
      return {
        'x-simple-filter--is-selected': this.filter.selected
      };
    }
  }
</script>

<docs>
#Example

This component renders a button, which on clicked emits the `UserClickedAFilter` and the
`UserClickedASimpleFilter` events. By default, it renders the filter label as the button text.

## Basic usage

```vue
<BaseSimpleFilter :filter="filter" />
```

## Customizing its contents

```vue
<BaseSimpleFilter :filter="filter" v-slot="{ filter }">
  <img src="checkbox.png"/>
  <span>{{ filter.label }}</span>
</BaseSimpleFilter>
```
</docs>
