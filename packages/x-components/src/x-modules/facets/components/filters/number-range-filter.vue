<template>
  <BaseFilter
    v-slot="{ filter: slotFilter }"
    class="x-number-range-filter"
    :filter="filter"
    :clickEvents="clickEvents"
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
  import { NumberRangeFilter as NumberRangeFilterModel } from '@empathyco/x-types';
  import { xComponentMixin } from '../../../../components';
  import { VueCSSClasses } from '../../../../utils/types';
  import { XEventsTypes } from '../../../../wiring/events.types';
  import { facetsXModule } from '../../x-module';
  import BaseFilter from './base-filter.vue';

  /**
   * Renders a number range filter, emitting the needed events when clicked.
   *
   * @public
   */
  @Component({
    components: { BaseFilter },
    mixins: [xComponentMixin(facetsXModule)]
  })
  export default class NumberRangeFilter extends Vue {
    /** The filter data to render. */
    @Prop({ required: true })
    public filter!: NumberRangeFilterModel;

    /**
     * Additional events to emit when the filter is clicked.
     *
     * @returns A dictionary with the events to be emitted when the filter is clicked, and its
     * payload.
     * @internal
     */
    protected get clickEvents(): Partial<XEventsTypes> {
      return {
        UserClickedANumberRangeFilter: this.filter
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
        'x-number-range-filter--is-selected': this.filter.selected
      };
    }
  }
</script>

<docs>
#Example

This component renders a button, which on clicked emits the `UserClickedAFilter` and the
`UserClickedANumberRangeFilter` events. By default, it renders the filter label as the button text.

## Basic usage

```vue
<NumberRangeFilter :filter="filter" />
```

## Customizing its contents

```vue
<NumberRangeFilter :filter="filter" v-slot="{ filter }">
  <img src="checkbox.png"/>
  <span>{{ filter.label }}</span>
</NumberRangeFilter>
```

## Events

A list of events that the component will emit:

- `UserClickedANumberRangeFilter`: the event is emitted after the user clicks the button. The event
payload is the number range filter.
</docs>
