<template>
  <div class="x-hierarchical-filter-container" data-test="hierarchical-filter-container">
    <RenderlessFilter
      v-slot="{ filter: filterBinding, clickFilter, cssClasses: cssClassesBinding, isDisabled }"
      :filter="filter"
      :click-events="innerClickEvents"
      :css-classes="innerCssClasses"
    >
      <!--
        @slot The content to render inside the button.
            @binding {Filter} filter - The filter data.
            @binding {Function} clickFilter - The handler to invoke when clicking the filter.
            @binding {VueCssClasses} cssClasses - The CSS classes.
            @binding {boolean} isDisabled - Flag determining the disabled state.
      -->
      <slot
        v-bind="{ filter: filterBinding, clickFilter, cssClasses: cssClassesBinding, isDisabled }"
      >
        <button
          :aria-checked="filterBinding.selected.toString()"
          :class="[cssClassesBinding, filterItemClass]"
          :disabled="isDisabled"
          data-test="filter"
          role="checkbox"
          @click="clickFilter"
        >
          <!--
            @slot The content to render inside the button.
               @binding {Filter} filter - The filter data.
          -->
          <slot name="label" :filter="filterBinding">{{ filterBinding.label }}</slot>
        </button>
      </slot>
    </RenderlessFilter>
    <FiltersList
      v-slot="{ filter: childFilter }"
      :animation="childrenAnimation"
      :filters="renderedChildrenFilters"
      :parent-id="filter.id"
      class="x-hierarchical-filter__children"
      :class="childrenFiltersClass"
      data-test="children-filters"
    >
      <HierarchicalFilter
        :children-animation="childrenAnimation"
        :filter="childFilter"
        :click-events="getChildFilterClickEvents(childFilter)"
        :children-filters-class="childrenFiltersClass"
        :filter-item-class="filterItemClass"
      >
        <template
          #default="{
            filter: filterBinding,
            clickFilter,
            cssClasses: cssClassesBinding,
            isDisabled,
          }"
        >
          <slot
            v-bind="{
              filter: filterBinding,
              clickFilter,
              cssClasses: cssClassesBinding,
              isDisabled,
            }"
          />
        </template>
        <template #label="{ filter: filterBinding }">
          <slot name="label" :filter="filterBinding" />
        </template>
      </HierarchicalFilter>
    </FiltersList>
  </div>
</template>

<script lang="ts">
import type { Filter, HierarchicalFilter as HierarchicalFilterModel } from '@empathyco/x-types'
import type { Dictionary } from '@empathyco/x-utils'
import type { PropType } from 'vue'
import type { XEventsTypes } from '../../../../wiring/events.types'
import { isHierarchicalFilter } from '@empathyco/x-types'
import { isObject } from '@empathyco/x-utils'
import { computed, defineComponent } from 'vue'
import { AnimationProp } from '../../../../types'
import { facetsXModule } from '../../x-module'
import FiltersList from '../lists/filters-list.vue'
import RenderlessFilter from './renderless-filter.vue'

/**
 * Renders a hierarchical filter recursively, emitting the needed events when clicked.
 *
 * @public
 */
export default defineComponent({
  name: 'HierarchicalFilter',
  xModule: facetsXModule.name,
  components: { FiltersList, RenderlessFilter },
  props: {
    /** The filter data to render. */
    filter: {
      type: Object as PropType<HierarchicalFilterModel>,
      required: true,
    },
    /** The animation component to use for the children filters. */
    childrenAnimation: AnimationProp,
    /**
     * Additional events, with their payload, to emit when the filter is clicked.
     *
     * @public
     */
    clickEvents: Object as PropType<Partial<XEventsTypes>>,
    /** Inheritance CSS classes. */
    cssClasses: {
      type: Array as PropType<(string | Dictionary<boolean>)[]>,
      default: () => [],
    },
    /** Class inherited by content element. */
    childrenFiltersClass: String,
    /** Class inherited by content element. */
    filterItemClass: String,
  },
  setup(props) {
    /**
     * The {@link XEventsTypes} to emit.
     *
     * @returns The events to emit when clicked.
     * @internal
     */
    const innerClickEvents = computed(() => ({
      UserClickedAHierarchicalFilter: props.filter,
      ...props.clickEvents,
    }))

    const isFilterPartiallySelected = (filter: HierarchicalFilterModel) => {
      const selectedChildren = filter.children?.filter(filter => filter.selected)
      const filterChildrenLength = filter.children?.length ?? 0
      return (
        !!selectedChildren &&
        ((selectedChildren.length > 0 && selectedChildren.length < filterChildrenLength) ||
          selectedChildren.some(isFilterPartiallySelected))
      )
    }

    /**
     * Returns if the filter is partially selected, which means having more than one child filter
     * selected, but not every of them, or having at least one child filter partially selected.
     *
     * @returns True if the filter is partially selected. False otherwise.
     * @internal
     */
    const isPartiallySelected = computed(() => isFilterPartiallySelected(props.filter))

    /**
     * Dynamic CSS classes to apply to the component.
     *
     * @returns The dynamic CSS classes to apply to the component.
     * @internal
     */
    const innerCssClasses = computed(() => [
      'x-hierarchical-filter',
      { 'x-hierarchical-filter--is-partially-selected': isPartiallySelected.value },
      { 'x-hierarchical-filter--is-selected': props.filter.selected },
      { 'x-facet-filter--is-partially-selected': isPartiallySelected.value },
      ...props.cssClasses,
    ])

    /**
     * Gets the child filter click events, converting the payload of the events that have a
     * {@link HierarchicalFilter} as payload to the corresponding child filter.
     *
     * @param childFilter - The child filter.
     * @returns The events to emit when clicking a child.
     * @internal
     */
    const getChildFilterClickEvents = (childFilter: HierarchicalFilterModel) => {
      return Object.entries(innerClickEvents.value).reduce((clickEvents, [event, payload]) => {
        return {
          ...clickEvents,
          [event]:
            isObject(payload) &&
            isHierarchicalFilter(payload as unknown as Filter) &&
            childFilter !== (payload as unknown as HierarchicalFilterModel)
              ? childFilter
              : payload,
        }
      }, {} as Partial<XEventsTypes>)
    }

    /**
     * List of filters to render, in case that the children's array
     * is empty it will return an empty array instead of inject the ones from the parent.
     *
     * @returns A list of filters.
     * @internal
     */
    const renderedChildrenFilters = computed(() => props.filter.children ?? [])

    return {
      innerClickEvents,
      innerCssClasses,
      renderedChildrenFilters,
      getChildFilterClickEvents,
    }
  },
})
</script>

<docs lang="mdx">
## Events

A list of events that the component will emit:

- [`UserClickedAFilter`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts):
  the event is emitted after the user clicks the button, using the `filter` prop as its payload.
- [`UserClickedAHierarchicalFilter`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts):
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

<script setup>
import { HierarchicalFilter } from '@empathyco/x-components/facets'
import { ref } from 'vue'

const filter = ref({
  id: `categories:men`,
  modelName: 'HierarchicalFilter',
  label: `men`,
  facetId: 'categories',
  parentId: null,
  totalResults: 10,
  children: [],
  selected: false,
})
</script>
```

### Playing with props

Configuring the events to emit when the filter is clicked.

```vue
<template>
  <HierarchicalFilter :clickEvents="{ UserClickedAHierarchicalFilter: filter }" :filter="filter" />
</template>

<script setup>
import { HierarchicalFilter } from '@empathyco/x-components/facets'
import { ref } from 'vue'

const filter = ref({
  id: `categories:men`,
  modelName: 'HierarchicalFilter',
  label: `men`,
  facetId: 'categories',
  parentId: null,
  totalResults: 10,
  children: [],
  selected: false,
})
</script>
```

### Customizing the default slot content

In this example, the child filters will also include the label and checkbox.

```vue
<template>
  <HierarchicalFilter :filter="filter" v-slot="{ filter, clickFilter, cssClasses, isDisabled }">
    <label :class="cssClasses">
      <input @change="clickFilter" :disabled="isDisabled" />
      {{ filter.label }}
    </label>
  </HierarchicalFilter>
</template>

<script setup>
import { HierarchicalFilter } from '@empathyco/x-components/facets'
import { ref } from 'vue'

const filter = ref({
  id: `categories:men`,
  modelName: 'HierarchicalFilter',
  label: `men`,
  facetId: 'categories',
  parentId: null,
  totalResults: 10,
  children: [],
  selected: false,
})
</script>
```

### Customizing the label slot content

```vue
<template>
  <HierarchicalFilter :filter="filter">
    <template #label="{ filter }">
      <span class="custom-class">{{ filter.label }}</span>
    </template>
  </HierarchicalFilter>
</template>

<script setup>
import { HierarchicalFilter } from '@empathyco/x-components/facets'
import { ref } from 'vue'

const filter = ref({
  id: `categories:men`,
  modelName: 'HierarchicalFilter',
  label: `men`,
  facetId: 'categories',
  parentId: null,
  totalResults: 10,
  children: [],
  selected: false,
})
</script>
```

### Customizing the content with classes

The `childrenFiltersClass` prop can be used to add classes to the inner filters lists. This is
useful to set the indent of the children filters.

The `filterItemClass` prop can be used to add classes to the filter element itself.

```vue
<template>
  <HierarchicalFilter
    :filter="filter"
    childrenFiltersClass="x-custom-class"
    filterItemClass="x-custom-filter"
  />
</template>

<script setup>
import { HierarchicalFilter } from '@empathyco/x-components/facets'
import { ref } from 'vue'

const filter = ref({
  id: `categories:men`,
  modelName: 'HierarchicalFilter',
  label: `men`,
  facetId: 'categories',
  parentId: null,
  totalResults: 10,
  children: [],
  selected: false,
})
</script>
```
</docs>
