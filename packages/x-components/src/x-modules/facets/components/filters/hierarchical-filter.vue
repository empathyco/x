<template>
  <div class="x-hierarchical-filter-container" data-test="hierarchical-filter-container">
    <BaseFilter
      v-slot="{ filter: slotFilter }"
      class="x-hierarchical-filter"
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
    <Filters
      v-slot="{ filter: childFilter }"
      :filters="filter.children"
      :animation="childrenAnimation"
      data-test="children-filters"
    >
      <HierarchicalFilter
        v-slot="{ filter: hierarchicalChildFilter }"
        :filter="childFilter"
        :childrenAnimation="childrenAnimation"
      >
        <slot :filter="hierarchicalChildFilter" />
      </HierarchicalFilter>
    </Filters>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { HierarchicalFilter as HierarchicalFilterModel } from '@empathy/search-types';
  import { xComponentMixin } from '../../../../components';
  import { isFilterPartiallySelected } from '../../../../utils/filters';
  import { VueCSSClasses } from '../../../../utils/types';
  import { XEventsTypes } from '../../../../wiring/events.types';
  import { facetsXModule } from '../../x-module';
  import Filters from '../lists/filters.vue';
  import BaseFilter from './base-filter.vue';

  /**
   * Renders a hierarchical filter recursively, emitting the needed events when clicked.
   *
   * @public
   */
  @Component({
    name: 'HierarchicalFilter',
    components: { Filters, BaseFilter },
    mixins: [xComponentMixin(facetsXModule)]
  })
  export default class HierarchicalFilter extends Vue {
    /** The filter data to render. */
    @Prop({ required: true })
    public filter!: HierarchicalFilterModel;

    /** The animation component to use for the children filters. */
    @Prop()
    public childrenAnimation?: Vue | string;

    /**
     * Additional events to emit when the filter is clicked.
     *
     * @returns A dictionary with the events to be emitted when the filter is clicked, and its
     * payload.
     * @internal
     */
    protected get clickEvents(): Partial<XEventsTypes> {
      return {
        UserClickedAHierarchicalFilter: this.filter
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
        'x-hierarchical-filter--is-partially-selected': this.isPartiallySelected,
        'x-hierarchical-filter--is-selected': this.filter.selected,
        'x-filter--is-partially-selected': this.isPartiallySelected
      };
    }

    /**
     * Returns if the filter is partially selected, which means having more than one child filter
     * selected, but not every of them, or having at least one child filter partially selected.
     *
     * @returns True if the filter is partially selected. False otherwise.
     * @internal
     */
    protected get isPartiallySelected(): boolean {
      return isFilterPartiallySelected(this.filter);
    }
  }
</script>

<docs>
#Example

This component renders a button, which on clicked emits the `UserClickedAFilter` and
`UserClickedAHierarchicalFilter` events. By default it renders the filter label as the button text.
If the provided filter has children filters, this component will render them recursively. Changing
the slot content will change it for all of the children.

## Basic usage

```vue
<HierarchicalFilter :filter="filter"/>
```

## Customizing its contents

In this example, the child filters will also include the new checkbox image.

```vue
<HierarchicalFilter :filter="filter" v-slot="{ filter }">
  <img src="checkbox.png"/>
  <span>{{ filter.label }}</span>
</HierarchicalFilter>
```
</docs>
