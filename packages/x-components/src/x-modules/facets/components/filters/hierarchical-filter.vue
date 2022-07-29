<template>
  <div class="x-hierarchical-filter-container" data-test="hierarchical-filter-container">
    <RenderlessFilter
      v-slot="{ filter, clickFilter, cssClasses, isDisabled }"
      :class="cssClasses"
      :clickEvents="_clickEvents"
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
    <FiltersList
      v-slot="{ filter: childFilter }"
      :animation="childrenAnimation"
      :filters="renderedChildrenFilters"
      :parent-id="filter.id"
      class="x-hierarchical-filter__children"
      data-test="children-filters"
    >
      <HierarchicalFilter
        :childrenAnimation="childrenAnimation"
        :filter="childFilter"
        :clickEvents="getChildFilterClickEvents(childFilter)"
      >
        <template #default="{ filter, clickFilter, cssClasses, isDisabled }">
          <slot v-bind="{ filter, clickFilter, cssClasses, isDisabled }" />
        </template>
        <template #label="{ filter }">
          <slot name="label" :filter="filter" />
        </template>
      </HierarchicalFilter>
    </FiltersList>
  </div>
</template>

<script lang="ts">
  import {
    Filter,
    HierarchicalFilter as HierarchicalFilterModel,
    isHierarchicalFilter
  } from '@empathyco/x-types';
  import { isObject } from '@empathyco/x-utils';
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { xComponentMixin } from '../../../../components/x-component.mixin';
  import { VueCSSClasses } from '../../../../utils/types';
  import { XEventsTypes } from '../../../../wiring/events.types';
  import { facetsXModule } from '../../x-module';
  import FiltersList from '../lists/filters-list.vue';
  import RenderlessFilter from './renderless-filter.vue';

  /**
   * Renders a hierarchical filter recursively, emitting the needed events when clicked.
   *
   * @public
   */
  @Component({
    name: 'HierarchicalFilter',
    components: { FiltersList, RenderlessFilter },
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
     * Additional events, with their payload, to emit when the filter is clicked.
     *
     * @public
     */
    @Prop()
    public clickEvents!: Partial<XEventsTypes>;

    /**
     * The {@link XEventsTypes | events} to emit.
     *
     * @returns The events to emit when clicked.
     * @internal
     */
    protected get _clickEvents(): Partial<XEventsTypes> {
      return {
        UserClickedAHierarchicalFilter: this.filter,
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
        'x-hierarchical-filter--is-partially-selected': this.isPartiallySelected,
        'x-hierarchical-filter--is-selected': this.filter.selected,
        'x-filter--is-partially-selected': this.isPartiallySelected
      };
    }

    /**
     * Gets the child filter click events, converting the payload of the events that have a
     * {@link @empathyco/x-types#HierarchicalFilter} as payload to the corresponding child filter.
     *
     * @param childFilter - The child filter.
     * @returns The events to emit when clicking a child.
     * @internal
     */
    protected getChildFilterClickEvents(
      childFilter: HierarchicalFilterModel
    ): Partial<XEventsTypes> {
      return Object.entries(this._clickEvents).reduce((clickEvents, [event, payload]) => {
        return {
          ...clickEvents,
          [event]:
            isObject(payload) &&
            isHierarchicalFilter(payload as unknown as Filter) &&
            childFilter !== (payload as unknown as HierarchicalFilterModel)
              ? childFilter
              : payload
        };
      }, {} as Partial<XEventsTypes>);
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
     * @internal
     */
    protected get renderedChildrenFilters(): Filter[] {
      return this.filter.children ?? [];
    }

    protected isFilterPartiallySelected(filter: HierarchicalFilterModel): boolean {
      const selectedChildren = filter.children?.filter(filter => filter.selected);
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

<docs lang="mdx">
## Events

A list of events that the component will emit:

- [`UserClickedAFilter`](x-components.xeventstypes.userclickedafilter.md): the event is emitted
  after the user clicks the button, using the `filter` prop as its payload.
- [`UserClickedAHierarchicalFilter`](x-components.xeventstypes.userclickedahierarchicalfilter.md):
  the event is emitted after the user clicks the button, using the `filter` prop as its payload.
  filter.

## See it in action

This component renders a button, which on clicked emits the `UserClickedAFilter` and
`UserClickedAHierarchicalFilter` events. By default it renders the filter label as the button text.
If the provided filter has children filters, this component will render them recursively. Changing
the slot content will change it for all of the children.

The `filter` prop is required. The `clickEvents` prop is optional and allows configuring the events
to emit on click.

```vue
<template>
  <HierarchicalFilter :filter="filter" />
</template>

<script>
  import { HierarchicalFilter } from '@empathyco/x-components/facets';

  export default {
    name: 'HierarchicalFilterTest',
    components: {
      HierarchicalFilter
    },
    date() {
      return {
        filter: {
          id: `categories:men`,
          modelName: 'HierarchicalFilter',
          label: `men`,
          facetId: 'categories',
          parentId: null,
          totalResults: 10,
          children: [],
          selected: false
        }
      };
    }
  };
</script>
```

### Playing with props

Configuring the events to emit when the filter is clicked.

```vue
<template>
  <HierarchicalFilter :clickEvents="{ UserClickedAHierarchicalFilter: filter }" :filter="filter" />
</template>

<script>
  import { HierarchicalFilter } from '@empathyco/x-components/facets';

  export default {
    name: 'HierarchicalFilterTest',
    components: {
      HierarchicalFilter
    },
    date() {
      return {
        filter: {
          id: `categories:men`,
          modelName: 'HierarchicalFilter',
          label: `men`,
          facetId: 'categories',
          parentId: null,
          totalResults: 10,
          children: [],
          selected: false
        }
      };
    }
  };
</script>
```

### Customizing the default slot content

In this example, the child filters will also include the label and checkbox.

```vue
<template>
  <HierarchicalFilter :filter="filter" v-slot="{ filter, clickFilter, slotCSSClasses, isDisabled }">
    <label :class="slotCSSClasses">
      <input @change="clickFilter" :disabled="isDisabled" />
      {{ filter.label }}
    </label>
  </HierarchicalFilter>
</template>

<script>
  import { HierarchicalFilter } from '@empathyco/x-components/facets';

  export default {
    name: 'HierarchicalFilterTest',
    components: {
      HierarchicalFilter
    },
    date() {
      return {
        filter: {
          id: `categories:men`,
          modelName: 'HierarchicalFilter',
          label: `men`,
          facetId: 'categories',
          parentId: null,
          totalResults: 10,
          children: [],
          selected: false
        }
      };
    }
  };
</script>
```

### Customizing the label slot content

```vue
<template>
  <HierarchicalFilter :filter="filter">
    <template #label :filter="filter">
      <span class="custom-class">{{ filter.label }}</span>
    </template>
  </HierarchicalFilter>
</template>

<script>
  import { HierarchicalFilter } from '@empathyco/x-components/facets';

  export default {
    name: 'HierarchicalFilterTest',
    components: {
      HierarchicalFilter
    },
    date() {
      return {
        filter: {
          id: `categories:men`,
          modelName: 'HierarchicalFilter',
          label: `men`,
          facetId: 'categories',
          parentId: null,
          totalResults: 10,
          children: [],
          selected: false
        }
      };
    }
  };
</script>
```
</docs>
