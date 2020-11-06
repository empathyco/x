<template>
  <BaseEventButton
    class="x-simple-filter x-filter"
    data-test="filter"
    role="checkbox"
    :aria-checked="filter.selected.toString()"
    :events="events"
    :class="cssClasses"
  >
    <!--
        TODO Update with @empathy/search-types@6.0.0
        @slot The content to render inside the button
            @binding {Filter} filter - The filter data
      -->
    <slot :filter="filter">{{ filter.title }}</slot>
  </BaseEventButton>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import BaseEventButton from '../../components/base-event-button.vue';
  import { SimpleFilter } from '@empathy/search-types';
  import { VueCSSClasses } from '../../utils/types';
  import { XEventsTypes } from '../../wiring/events.types';

  /**
   * Renders a simple filter, emitting the needed events when clicked.
   *
   * @public
   */
  @Component({
    components: { BaseEventButton }
  })
  export default class BaseSimpleFilter extends Vue {
    /** The filter data to render. */
    @Prop({ required: true })
    public filter!: SimpleFilter;

    /**
     * The events that will be emitted when the filter is clicked.
     *
     * @returns The events to be emitted when the filter is clicked.
     * @internal
     */
    protected get events(): Partial<XEventsTypes> {
      return {
        UserClickedAFilter: this.filter
      }
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
        'x-simple-filter--is-selected': this.filter.selected
      }
    }
  }
</script>

<docs>
#Example

This component renders a button, which on clicked emits the `UserClickedAFilter` event. By default
it renders the filter label as the button text.

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
