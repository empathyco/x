<template>
  <div class="x-hierarchical-filter-container" data-test="hierarchical-filter-container">
    <RenderlessFilter
      v-slot="{ filter, clickFilter, cssClasses, isDisabled }"
      :class="cssClasses"
      :clickEvents="clickEvents"
      :filter="filter"
      class="x-hierarchical-filter"
    >
      <!--
        @slot The content to render inside the button.
            @binding {Filter} filter - The filter data.
            @binding {Function} clickFilter - The handler to invoke when clicking the filter.
            @binding {VueCssClasses} cssClasses - The CSS classes.
            @binding {boolean} isDisabled - Flag determining the disabled state.
      -->
      <slot v-bind="{ filter, clickFilter, cssClasses, isDisabled }">
        <button
          @click="clickFilter"
          :aria-checked="filter.selected.toString()"
          :class="cssClasses"
          :disabled="isDisabled"
          :events="clickEvents"
          data-test="filter"
          role="checkbox"
        >
          <!--
            @slot The content to render inside the button.
               @binding {Filter} filter - The filter data.
          -->
          <slot name="label" :filter="filter">{{ filter.label }}</slot>
        </button>
      </slot>
    </RenderlessFilter>
    <Filters
      #default="{ filter: childFilter }"
      :animation="childrenAnimation"
      :filters="renderedChildrenFilters"
      class="x-hierarchical-filter__children"
      data-test="children-filters"
    >
      <HierarchicalFilter :childrenAnimation="childrenAnimation" :filter="childFilter">
        <template #default="{ filter, clickFilter, cssClasses, isDisabled }">
          <slot v-bind="{ filter, clickFilter, cssClasses, isDisabled }" />
        </template>
        <template #label="{ filter }">
          <slot name="label" :filter="filter" />
        </template>
      </HierarchicalFilter>
    </Filters>
  </div>
</template>

<script lang="ts">
  import { Filter, HierarchicalFilter as HierarchicalFilterModel } from '@empathyco/x-types-next';
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { State, xComponentMixin } from '../../../../components';
  import { VueCSSClasses } from '../../../../utils/types';
  import { XEventsTypes } from '../../../../wiring/events.types';
  import { facetsNextXModule } from '../../x-module';
  import Filters from '../lists/filters.vue';
  import RenderlessFilter from './renderless-filter.vue';

  /**
   * Renders a hierarchical filter recursively, emitting the needed events when clicked.
   *
   * @public
   */
  @Component({
    name: 'HierarchicalFilter',
    components: { Filters, RenderlessFilter },
    mixins: [xComponentMixin(facetsNextXModule)]
  })
  export default class HierarchicalFilter extends Vue {
    /** The filter data to render. */
    @Prop({ required: true })
    public filter!: HierarchicalFilterModel;

    /** The animation component to use for the children filters. */
    @Prop()
    public childrenAnimation?: Vue | string;
    /**
     * The state filters.
     *
     * @internal
     */
    @State('facetsNext', 'filters')
    public filters!: Record<Filter['id'], Filter>;

    /**
     * Additional events to emit when the filter is clicked.
     *
     * @returns A dictionary with the events to be emitted when the filter is clicked, and its
     * payload.
     * @internal
     */
    protected get clickEvents(): Partial<XEventsTypes> {
      return {
        UserClickedANextHierarchicalFilter: this.filter
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
      return this.isFilterPartiallySelected(this.filter);
    }

    /**
     * List of filters to render, in case that the children's array
     * is empty it will return an empty array instead of inject the ones from the parent.
     *
     * @returns A list of filters.
     *
     * @internal
     */
    protected get renderedChildrenFilters(): Filter[] {
      return this.filter.children?.map(filterId => this.filters[filterId]) ?? [];
    }

    protected isFilterPartiallySelected(filter: HierarchicalFilterModel): boolean {
      const selectedChildren = filter.children
        ?.map(filterId => this.filters[filterId])
        ?.filter(filter => filter?.selected) as HierarchicalFilterModel[] | undefined;
      const filterChildrenLength = filter.children?.length ?? 0;
      return (
        !!selectedChildren &&
        ((selectedChildren.length > 0 && selectedChildren.length < filterChildrenLength) ||
          // eslint-disable-next-line @typescript-eslint/unbound-method
          selectedChildren.some(this.isFilterPartiallySelected))
      );
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
<template>
  <HierarchicalFilter
    :filter="filter"
    v-slot="{ filter: slotFilter, clickFilter, cssClasses, isDisabled }"
  />
</template>
```

## Customizing the default slot content

In this example, the child filters will also include the label and checkbox.

```vue
<HierarchicalFilter :filter="filter" v-slot="{ filter, clickFilter, slotCSSClasses, isDisabled }">
  <label :class="slotCSSClasses">
    <input @change="clickFilter" :disabled="isDisabled">
    {{ filter.label }}
  </label>
</HierarchicalFilter>
```

## Customizing the label slot content

```vue
<HierarchicalFilter :filter="filter">
  <template #label :filter="filter">
    <span class="custom-class">{{ filter.label }}</span>
  </template>
</HierarchicalFilter>
```

## Events

A list of events that the component will emit:

- `UserClickedAHierarchicalFilter`: the event is emitted after the user clicks the button. The
event payload is the hierarchical filter.
</docs>
