<template>
  <div class="x-filters-search" :class="cssClasses" data-test="filters-search">
    <!--
      @slot Search content. It is the content which triggers the filters sifting.
        @binding {string} query - The query to search in filters.
        @binding {Function} setQuery - The function to set the query. The query is passed as
        parameter.
        @binding {Function} clearQuery - The function to clear the query.
    -->
    <slot name="search" v-bind="{ query, setQuery, clearQuery }">
      <input
        :value="query"
        type="search"
        class="x-filters-search__input x-input"
        data-test="filters-search-input"
        aria-label="search into the filter values"
        @input="setQuery($event.target.value)"
      />
    </slot>
    <!--
      @slot (Required) Sifted filters content.
        @binding {Filter[]} siftedFilters - Sifted filters data.
    -->
    <slot :sifted-filters="siftedFilters"></slot>
  </div>
</template>

<script lang="ts">
import type { Filter } from '@empathyco/x-types'
import type { PropType } from 'vue'
import type { DebouncedFunction, VueCSSClasses } from '../../../../utils/types'
import { isBooleanFilter } from '@empathyco/x-types'
import { computed, defineComponent, provide, ref, watch } from 'vue'
import { debounce } from '../../../../utils/debounce'
import { normalizeString } from '../../../../utils/normalize'
import { useFiltersInjection } from '../../composables/use-filters-injection'
import { facetsXModule } from '../../x-module'

/**
 * Renders the filters sifted with the input query.
 *
 * @public
 */
export default defineComponent({
  name: 'FiltersSearch',
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

    /** The debounce time for applying the filter sifting. */
    debounceInMs: {
      type: Number,
      default: 200,
    },
  },
  setup(props) {
    const renderedFilters = useFiltersInjection(props)

    const query = ref('')
    let setQueryDebounced: DebouncedFunction<[string]>

    const debounceInMs = computed(() => props.debounceInMs)

    /**
     * Set the debounce function for setting the query debounced.
     *
     * @internal
     */
    const updateSetQueryDebounced = () => {
      setQueryDebounced = debounce(queryDebounced => {
        query.value = queryDebounced
      }, props.debounceInMs)
    }
    watch(debounceInMs, updateSetQueryDebounced, { immediate: true })

    /**
     * Sift the array of filters which matches with the query.
     *
     * @returns Array of sifted filters.
     * @internal
     */
    const siftedFilters = computed((): Filter[] => {
      const normalizedQuery = normalizeString(query.value)
      return renderedFilters.value.filter(
        filter =>
          isBooleanFilter(filter) && normalizeString(filter.label).includes(normalizedQuery),
      )
    })
    provide('filters', siftedFilters)

    /**
     * Adds the dynamic css classes to the component.
     *
     * @returns The class to be added to the component.
     * @internal
     */
    const cssClasses = computed((): VueCSSClasses => {
      return { 'x-filters-search--is-sifted': !!query.value }
    })

    /**
     * Set the query through the debounced function.
     *
     * @param query - The query to sift filters.
     * @internal
     */
    const setQuery = (query: string): void => {
      setQueryDebounced(query)
    }

    /**
     * Clear the query.
     *
     * @internal
     */
    const clearQuery = (): void => {
      query.value = ''
    }

    return {
      clearQuery,
      setQuery,
      cssClasses,
      siftedFilters,
      query,
    }
  },
})
</script>

<style lang="css" scoped>
.x-filters-search {
  display: flex;
  flex-flow: column nowrap;
}

.x-filters-search__input::-ms-clear {
  display: none;
  width: 0;
  height: 0;
}

.x-filters-search__input::-ms-reveal {
  display: none;
  width: 0;
  height: 0;
}

.x-filters-search__input::-webkit-search-decoration,
.x-filters-search__input::-webkit-search-cancel-button,
.x-filters-search__input::-webkit-search-results-button,
.x-filters-search__input::-webkit-search-results-decoration {
  display: none;
}
</style>

<docs lang="mdx">
## Examples

It renders an input and a list of filters passed as prop or being injected. The list of filters can
be sifted with the query typed in the input. This component has also a debounce prop to set the time
in milliseconds to apply the filters search. Moreover, it has two scoped slots. The first one for
customize the search triggering with three slot props; the query, a function to set the query by
sifting and a third one for cleaning the query. The second scoped slot is required and it is for
displaying the list of filters sifted. It has a slot prop with these filters sifted.

### Important

The component has two ways of receive the filters list, it can be injected by another component or
be send it as a prop. If the component doesnt have a parent component that receive and exposed a
filters list to their children, it is mandatory to send it as prop.

### Basic usage

Using default and required slot:

```vue
<template>
  <FiltersSearch :filters="filters" v-slot="{ siftedFilters }">
    <ul v-for="filter in siftedFilters">
      <li :key="filter.id">{{ filter.label }}</li>
    </ul>
  </FiltersSearch>
</template>

<script setup>
import { FiltersSearch } from '@empathyco/x-components/facets'
import { ref } from 'vue'

const filters = ref([
  { id: '1', label: 'Filter 1', modelName: 'SimpleFilter', selected: false },
  { id: '2', label: 'Filter 2', modelName: 'SimpleFilter', selected: false },
])
</script>
```

Setting debounce time:

```vue
<template>
  <FiltersSearch :filters="filters" :debounceInMs="500" v-slot="{ siftedFilters }">
    <ul v-for="filter in siftedFilters">
      <li :key="filter.id">{{ filter.label }}</li>
    </ul>
  </FiltersSearch>
</template>

<script setup>
import { FiltersSearch } from '@empathyco/x-components/facets'
import { ref } from 'vue'

const filters = ref([
  { id: '1', label: 'Filter 1', modelName: 'SimpleFilter', selected: false },
  { id: '2', label: 'Filter 2', modelName: 'SimpleFilter', selected: false },
])
</script>
```

Replacing search triggering:

```vue
<template>
  <FiltersSearch :filters="filters">
    <template #search="{ query, setQuery, clearQuery }">
      <input
        @input="setQuery($event.target.value)"
        :value="query"
        class="x-input x-filters-search__input"
        :aria-label="filtersSearchInputMessage"
      />
      <button @click="clearQuery">X</button>
    </template>
    <template #default="{ siftedFilters }">
      <ul v-for="filter in siftedFilters">
        <li :key="filter.id">{{ filter.label }}</li>
      </ul>
    </template>
  </FiltersSearch>
</template>

<script setup>
import { FiltersSearch } from '@empathyco/x-components/facets'
import { ref } from 'vue'

const filters = ref([
  { id: '1', label: 'Filter 1', modelName: 'SimpleFilter', selected: false },
  { id: '2', label: 'Filter 2', modelName: 'SimpleFilter', selected: false },
])
</script>
```

> **Using injection**: It can receive the filters list by injection. It only works if it has a
> parent component that receives and exposes the filters list. Using the injection, It is not
> necessary to send the prop to the child components, it has to be send it in the parent component,
> the rest of components will inject this list.

```vue
<template>
  <Facets v-slot="{ facet }">
    <SlicedFilters :filters="facet.filters" :max="8">
      <FiltersSearch>
        <Filters v-slot="{ filter }">
          <SimpleFilter :filter="filter" data-test="brand-filter" />
        </Filters>
      </FiltersSearch>
    </SlicedFilters>
  </Facets>
</template>

<script setup>
import { Facets } from '@empathyco/x-components/facets'
import { SlicedFilters, FiltersSearch, Filters, SimpleFilter } from '@empathyco/x-components/facets'
import { ref } from 'vue'

const facet = ref({
  filters: [
    { id: '1', label: 'Filter 1', modelName: 'SimpleFilter', selected: false },
    { id: '2', label: 'Filter 2', modelName: 'SimpleFilter', selected: false },
  ],
})
</script>
```
</docs>
