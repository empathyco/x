<template>
  <component
    :is="animation"
    v-if="hasFiltersToRender"
    tag="ul"
    class="x-filters"
    :class="cssClasses"
    data-test="base-filters"
  >
    <li
      v-for="filter in renderedFilters"
      :key="filter.id"
      class="x-filters__item"
      data-test="base-filters-item"
    >
      <!--
        @slot (Required) Filter content
            @binding {Filter} filter - Search-types filter data.
      -->
      <slot :filter="filter" />
    </li>
  </component>
</template>

<script lang="ts">
import type { Filter } from '@empathyco/x-types'
import type { PropType } from 'vue'
import type { VueCSSClasses } from '../../../../utils/types'
import { computed, defineComponent } from 'vue'
import { AnimationProp } from '../../../../types/animation-prop'
import { useFiltersInjection } from '../../composables/use-filters-injection'
import { facetsXModule } from '../../x-module'

/**
 * Renders a list with a list item per each
 * {@link @empathyco/x-types#BooleanFilter} in the filters prop array.
 * Each list item has a scoped slot, passing the filter as slot prop.
 *
 * @public
 */
export default defineComponent({
  name: 'FiltersList',
  xModule: facetsXModule.name,
  props: {
    /**
     * The list of filters to be rendered as slots.
     *
     * @public
     */
    filters: Array as PropType<Filter[]>,

    /**
     * This prop is used in the `HierarchicalFilter` component and only in that case. It is necessary
     * to make the `renderedFilters` to return only the filters of each level of the hierarchy.
     *
     * @public
     */
    parentId: {
      type: String as PropType<Filter['id']>,
      required: false,
    },

    /**
     * Animation component that will be used to animate the base filters.
     *
     * @public
     */
    animation: {
      type: AnimationProp,
      default: 'ul',
    },
  },
  setup(props) {
    const renderedFilters = useFiltersInjection(props)

    /**
     * It handles if the filters should be rendered.
     *
     * @returns True if there are filters.
     *
     * @public
     */
    const hasFiltersToRender = computed(() => {
      return renderedFilters?.value.length > 0
    })

    /**
     * Checks if at least one filter is selected.
     *
     * @returns True if at least one filter is selected. False otherwise.
     * @internal
     */
    const hasSelectedFilters = computed(() => {
      return !!renderedFilters?.value.some(filter => filter.selected)
    })

    /**
     * Dynamic CSS classes for the root element of this component.
     *
     * @returns An object containing the dynamic CSS classes and a boolean indicating if they should
     * be added or not.
     */
    const cssClasses = computed((): VueCSSClasses => {
      return {
        'x-filters--has-selected-filters': hasSelectedFilters.value,
      }
    })

    return {
      hasFiltersToRender,
      cssClasses,
      renderedFilters,
    }
  },
})
</script>

<style lang="css" scoped>
.x-filters {
  list-style-type: none;
}
</style>

<docs lang="mdx">
## Examples

Renders a list with a list item per each filter in the filters prop array. Each list item has a
scoped slot, passing the filter as slot prop.

### Important

The component has two ways of receive the filters list, it can be injected by another component or
be send it as a prop. If the component doesnt have a parent component that receive and exposed a
filters list to their children, it is mandatory to send it as prop.

### Basic usage

Using default slot:

```vue
<template>
  <FiltersList :filters="filters">
    <template #default="{ filter }">
      <p>{{ filter.label }}</p>
    </template>
  </FiltersList>
</template>

<script setup>
import { FiltersList } from '@empathyco/x-components/facets'
import { ref } from 'vue'

const filters = ref([
  { id: '1', label: 'Filter 1', modelName: 'SimpleFilter', selected: false },
  { id: '2', label: 'Filter 2', modelName: 'SimpleFilter', selected: false },
])
</script>
```

Using default slot abbreviated syntax:

```vue
<template>
  <FiltersList :filters="filters" v-slot="{ filter }">
    <p>{{ filter.label }}</p>
  </FiltersList>
</template>

<script setup>
import { FiltersList } from '@empathyco/x-components/facets'
import { ref } from 'vue'

const filters = ref([
  { id: '1', label: 'Filter 1', modelName: 'SimpleFilter', selected: false },
  { id: '2', label: 'Filter 2', modelName: 'SimpleFilter', selected: false },
])
</script>
```

> **Using injection**: It can receive the filters list by injection. It only works if it has a
> parent component that receives and exposes the filters list. Using the injection, It is not
> necessary to send the prop to the child components, it has to be send it in the parent component ,
> the rest of components will inject this list.

```vue
<template>
  <SlicedFilters :filters="filters">
    <FiltersList v-slot="{ filter }">
      <p>{{ filter.label }}</p>
    </FiltersList>
  </SlicedFilters>
</template>

<script setup>
import { SlicedFilters, FiltersList } from '@empathyco/x-components/facets'
import { ref } from 'vue'

const filters = ref([
  { id: '1', label: 'Filter 1', modelName: 'SimpleFilter', selected: false },
  { id: '2', label: 'Filter 2', modelName: 'SimpleFilter', selected: false },
])
</script>
```
</docs>
