<script lang="ts">
  import { BooleanFilter, Filter, isBooleanFilter } from '@empathyco/x-types';
  import { mixins } from 'vue-class-component';
  import { Component } from 'vue-property-decorator';
  import { CreateElement, VNode } from 'vue';
  import { xComponentMixin, XProvide } from '../../../../components';
  import { isArrayEmpty } from '../../../../utils';
  import { facetsXModule } from '../../x-module';
  import FiltersInjectionMixin from './filters-injection.mixin';

  /**
   * Component that sorts a list of filters and returns them using the default scoped slot.
   *
   * @public
   */
  @Component({
    mixins: [xComponentMixin(facetsXModule)]
  })
  export default class SortedFilters extends mixins(FiltersInjectionMixin) {
    /**
     * An array of filters with the selected filters at the beginning of the list.
     *
     * @returns Array of filters.
     * @internal
     */
    @XProvide('filters')
    public get sortedFilters(): Filter[] {
      if (!isArrayEmpty(this.renderedFilters) && isBooleanFilter(this.renderedFilters[0])) {
        return ([...this.renderedFilters] as BooleanFilter[]).sort(({ selected }) => {
          return selected ? -1 : 1;
        });
      }

      return this.renderedFilters;
    }

    render(h: CreateElement): VNode {
      return this.$scopedSlots.default?.({ filters: this.sortedFilters })?.[0] ?? h();
    }
  }
</script>

<docs lang="mdx">
# Example

The sorted filters component takes a list of filters and returns this new filters list sorted by the
`selected` filter property.

## Remarks

- The component can receive the filters list by property or using the XInjection feature.
- It also provides the resultant list bound in the default slot or with the XProvide feature.

Both XInjection and XProvide features are from the extended FiltersInjectionMixin. You don't have to
use XInjection and XProvide together, e.g. you can use pass the filters using a prop and then
returns the result with XProvide.

## Basic usage

### Using props and binding the result

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

### Using XInject and XProvide

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
