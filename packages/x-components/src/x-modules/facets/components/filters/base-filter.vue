<template>
  <BaseEventButton
    class="x-filter"
    data-test="filter"
    role="checkbox"
    :aria-checked="filter.selected.toString()"
    :events="events"
    :disabled="isDisabled"
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
  import { BooleanFilter } from '@empathyco/x-types-old';
  import { xComponentMixin } from '../../../../components';
  import BaseEventButton from '../../../../components/base-event-button.vue';
  import { VueCSSClasses } from '../../../../utils/types';
  import { XEventsTypes } from '../../../../wiring/events.types';
  import { facetsXModule } from '../../x-module';

  /**
   * Renders a button with a default slot. It receives a
   * {@link @empathyco/x-types-old#BooleanFilter | BooleanFilter} that will be used in the
   * default slot and the {@link XEvent | XEvents} that will be emitted when clicking the button.
   *
   * @public
   */
  @Component({
    components: { BaseEventButton },
    mixins: [xComponentMixin(facetsXModule)]
  })
  export default class BaseFilter extends Vue {
    /** The filter data to render. */
    @Prop({ required: true })
    public filter!: BooleanFilter;

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
     * Returns `true` when the filter should be disabled.
     *
     * @returns `true` if the filter should be disabled.
     * @internal
     */
    protected get isDisabled(): boolean {
      return this.filter.totalResults === 0;
    }

    /**
     * Dynamic CSS classes to apply to the component.
     *
     * @returns The dynamic CSS classes to apply to the component.
     * @internal
     */
    protected get cssClasses(): VueCSSClasses {
      return {
        'x-filter--is-selected': this.filter.selected,
        'x-filter--is-disabled': this.isDisabled
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
  import { BaseFilter } from '@empathyco/x-components';

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

## Events

A list of events that the component will emit:

- `UserClickedAFilter`: the event is emitted after the user clicks the filter. The event payload is
the filter data.
- Custom events defined in the `clickEvents` prop.
</docs>
