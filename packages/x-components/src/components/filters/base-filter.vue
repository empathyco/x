<template>
  <BaseEventButton
    class="x-filter"
    data-test="filter"
    role="checkbox"
    :aria-checked="filter.selected.toString()"
    :events="events"
    :class="cssClasses"
  >
    <!--
        @slot The content to render inside the button
            @binding {Filter} filter - The filter data
      -->
    <slot :filter="filter">{{ filter.label }}</slot>
  </BaseEventButton>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { Filter } from '@empathy/search-types';
  import BaseEventButton from '../../components/base-event-button.vue';
  import { VueCSSClasses } from '../../utils/types';
  import { XEventsTypes } from '../../wiring/events.types';

  /**
   * Renders a button with a default slot. It receives a filter that will be used in the default
   * slot and the {@link XEvent | XEvents} that will be emitted when clicking the button.
   *
   * @public
   */
  @Component({
    components: { BaseEventButton }
  })
  export default class BaseFilter extends Vue {
    /** The filter data to render. */
    @Prop({ required: true })
    public filter!: Filter;

    /** Additional events with its payload to emit when the filter is clicked. */
    @Prop()
    public clickEvents?: Partial<XEventsTypes>;

    /**
     * The events that will be emitted when the filter is clicked.
     *
     * @returns The events to be emitted when the filter is clicked.
     * @internal
     */
    protected get events(): Partial<XEventsTypes> {
      return {
        UserClickedAFilter: this.filter,
        ...this.clickEvents
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
        'x-filter--is-selected': this.filter.selected
      };
    }
  }
</script>

<docs>
#Example

This component receives a `filter` as prop and renders a button, which on clicked emits the
`UserClickedAFilter` event. If more events are needed to be emitted they can be passed using the
`clickEvents` prop. By default it renders the filter label as the button text.

## Basic usage

```vue
<BaseFilter :filter="filter"/>
```

## Customizing its contents

```vue
<BaseFilter :filter="filter" v-slot="{ filter }">
  <img src="checkbox.png"/>
  <span>{{ filter.label }}</span>
</BaseFilter>
```

## Extending the emitted events

```vue
<template>
  <BaseFilter :filter="filter" :clickEvents="clickEvents"/>
</template>

<script>
  import { BaseFilter } from '@empathy/x-components';

  export default {
    components: {
      BaseFilter
    },
    props: ['filter'], // Imagine this filter is of type HierarchicalFilter
    computed: {
      clickEvents() {
        return { UserClickedAHierarchicalFilter: this.filter };
      }
    }
  };
</script>
```

</docs>
