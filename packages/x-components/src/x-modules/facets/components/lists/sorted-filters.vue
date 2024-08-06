<script lang="ts">
  import { BooleanFilter, Filter, isBooleanFilter } from '@empathyco/x-types';
  import { computed, defineComponent, PropType, provide } from 'vue';
  import { isArrayEmpty } from '../../../../utils';
  import { facetsXModule } from '../../x-module';
  import { useFiltersInjection } from '../../composables/use-filters-injection';

  /**
   * Component that sorts a list of filters and returns them using the default scoped slot.
   *
   * @public
   */
  export default defineComponent({
    name: 'SortedFilters',
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
        required: false
      }
    },
    setup(props, { slots }) {
      const renderedFilters = useFiltersInjection(props);

      /**
       * An array of filters with the selected filters at the beginning of the list.
       *
       * @returns Array of filters.
       * @internal
       */
      const sortedFilters = computed((): Filter[] => {
        if (!isArrayEmpty(renderedFilters.value) && isBooleanFilter(renderedFilters.value[0])) {
          return ([...renderedFilters.value] as BooleanFilter[]).sort(({ selected }) => {
            return selected ? -1 : 1;
          });
        }

        return renderedFilters.value;
      });
      provide('filters', sortedFilters);

      return () => slots.default?.({ filters: sortedFilters.value })[0] ?? '';
    }
  });
</script>

<docs lang="mdx">
## Example

The sorted filters component takes a list of filters and returns this new filters list sorted by the
`selected` filter property.

### Remarks

- The component can receive the filters list by property or using the XInjection feature.
- It also provides the resultant list bound in the default slot or with the XProvide feature.

Both XInjection and XProvide features are from the extended FiltersInjectionMixin. You don't have to
use XInjection and XProvide together, e.g. you can use pass the filters using a prop and then
returns the result with XProvide.

### Basic usage

#### Using props and binding the result

```vue
<template>
  <Facets v-slot="{ facet }">
    <SortedFilters :filters="facet.filters" #default="{ sortedFilters }">
      <Filters :items="sortedFilters" v-slot="{ filter }">
        <SimpleFilter :filter="filter" />
      </Filters>
    </SortedFilters>
  </Facets>
</template>

<script>
  import { Facets, SimpleFilter, Filters } from '@empathyco/x-components';

  export default {
    components: {
      Facets,
      Filters,
      SimpleFilter
    }
  };
</script>
```

#### Using XInject and XProvide

```vue
<Facets v-slot="{ facet }">
  <FiltersSearch :filters="facet.filters">
    <SortedFilters>
      <Filters v-slot="{ filter }">
        <SimpleFilter :filter="filter"/>
      </Filters>
    </SortedFilters>
  </FiltersSearch>
</Facets>

<script>
  import { Facets, FiltersSearch, SimpleFilter, Filters } from '@empathyco/x-components';

  export default {
    components: {
      Facets,
      FiltersSearch,
      Filters,
      SimpleFilter
    }
  };
</script>
```
</docs>
