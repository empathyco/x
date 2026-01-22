<script lang="ts">
import type { Filter } from '@empathyco/x-types'
import type { PropType } from 'vue'
import { isBooleanFilter } from '@empathyco/x-types'
import { computed, defineComponent, provide } from 'vue'
import { useFiltersInjection } from '../../composables/use-filters-injection'
import { facetsXModule } from '../../x-module'

/**
 * The `ExcludeFiltersWithNoResults` component filters the provided list of filters, excluding
 * those which have the `totalResults` property exactly equal to `0`. It won't remove filters with
 * no `totalResults` property.
 *
 * The new list of filters is bound to the default scoped slot. As this component does not render
 * no root element, this default slot must contain a single root node.
 *
 * @public
 */
export default defineComponent({
  name: 'ExcludeFiltersWithNoResults',
  xModule: facetsXModule.name,
  props: {
    /** The list of filters to be rendered as slots. */
    filters: Array as PropType<Filter[]>,

    /**
     * This prop is used in the `HierarchicalFilter` component and only in that case. It is necessary
     * to make the `renderedFilters` to return only the filters of each level of the hierarchy.
     */
    parentId: {
      type: String as PropType<Filter['id']>,
    },
  },
  setup(props, { slots }) {
    const renderedFilters = useFiltersInjection(props)

    /**
     * Removes the filters that have exactly 0 results associated.
     *
     * @returns A sublist of the filters prop, excluding the ones with no results.
     */
    const filtersWithResults = computed(() =>
      renderedFilters.value.filter(filter => !isBooleanFilter(filter) || filter.totalResults !== 0),
    )
    provide('filters', filtersWithResults)

    return () => slots.default?.({ filters: filtersWithResults.value })[0] ?? ''
  },
})
</script>

<docs lang="mdx">
## Example

The `ExcludeFiltersWithNoResults` component filters the provided list of filter, excluding those
which have the `totalResults` property exactly equal to `0`. It won't remove filters with no
`totalResults` property.

The new list of filters is bound to the default scoped slot. As this component does not render no
root element, this default slot must contain a single root node.

### Important

The component has two ways of receive the filters list, it can be injected by another component or
be send it as a prop. If the component doesnt have a parent component that receive and exposed a
filters list to their children, it is mandatory to send it as prop.

### Basic Usage

```vue
<template>
  <ExcludeFiltersWithNoResults v-slot="{ filters }" :filters="filters">
    <div>
      <span v-for="filter in filters" :key="filter.id">{{ filter.label }}</span>
    </div>
  </ExcludeFiltersWithNoResults>
</template>

<script setup>
import { ExcludeFiltersWithNoResults } from '@empathyco/x-components/facets'
import { ref } from 'vue'

const filters = ref([
  {
    // This is the only filter that will be removed.
    facetId: 'category',
    id: 'category:men',
    modelName: 'SimpleFilter',
    selected: false,
    label: 'Men',
    totalResults: 0,
  },
  {
    facetId: 'category',
    id: 'category:women',
    modelName: 'SimpleFilter',
    selected: false,
    label: 'Women',
    totalResults: 10,
  },
  {
    facetId: 'category',
    id: 'category:kids',
    modelName: 'SimpleFilter',
    selected: false,
    label: 'Kids',
    totalResults: undefined,
  },
])
</script>
```

> **Using injection**: It can receive the filters list by injection. It only works if it has a
> parent component that receives and exposes the filters list. Using the injection, It is not
> necessary to send the prop to the child components, it has to be send it in the parent component,
> the rest of components will inject this list.

```vue
<template>
  <ExcludeFiltersWithNoResults :filters="filters">
    <FiltersSearch>
      <Filters v-slot="{ filter }">
        <SimpleFilter :filter="filter" data-test="brand-filter" />
      </Filters>
    </FiltersSearch>
  </ExcludeFiltersWithNoResults>
</template>

<script setup>
import {
  ExcludeFiltersWithNoResults,
  FiltersSearch,
  Filters,
  SimpleFilter,
} from '@empathyco/x-components/facets'
import { ref } from 'vue'

const filters = ref([
  {
    // This is the only filter that will be removed.
    facetId: 'category',
    id: 'category:men',
    modelName: 'SimpleFilter',
    selected: false,
    label: 'Men',
    totalResults: 0,
  },
  {
    facetId: 'category',
    id: 'category:women',
    modelName: 'SimpleFilter',
    selected: false,
    label: 'Women',
    totalResults: 10,
  },
  {
    facetId: 'category',
    id: 'category:kids',
    modelName: 'SimpleFilter',
    selected: false,
    label: 'Kids',
    totalResults: undefined,
  },
])
</script>
```
</docs>
