<script lang="ts">
  import { Filter, isBooleanFilter } from '@empathyco/x-types';
  import { CreateElement, VNode } from 'vue';
  import { mixins } from 'vue-class-component';
  import { Component } from 'vue-property-decorator';
  import { xComponentMixin, XProvide } from '../../../../components';
  import { facetsXModule } from '../../x-module';
  import FiltersInjectionMixin from './filters-injection.mixin';

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
  @Component({
    mixins: [xComponentMixin(facetsXModule)]
  })
  export default class ExcludeFiltersWithNoResults extends mixins(FiltersInjectionMixin) {
    /**
     * Removes the filters that have exactly 0 results associated.
     *
     * @returns A sublist of the filters prop, excluding the ones with no results.
     * @internal
     */
    @XProvide('filters')
    public get filtersWithResults(): Filter[] {
      return this.renderedFilters.filter(
        filter => !isBooleanFilter(filter) || filter.totalResults !== 0
      );
    }

    render(h: CreateElement): VNode {
      return this.$scopedSlots.default?.({ filters: this.filtersWithResults })?.[0] ?? h();
    }
  }
</script>

<docs lang="mdx">
# Example

The `ExcludeFiltersWithNoResults` component filters the provided list of filter, excluding those
which have the `totalResults` property exactly equal to `0`. It won't remove filters with no
`totalResults` property.

The new list of filters is bound to the default scoped slot. As this component does not render no
root element, this default slot must contain a single root node.

## Important

The component has two ways of receive the filters list, it can be injected by another component or
be send it as a prop. If the component doesnt have a parent component that receive and exposed a
filters list to their children, it is mandatory to send it as prop.

## Basic Usage

```vue
<template>
  <ExcludeFiltersWithNoResults v-slot="{ filters }" :filters="filters">
    <div>
      <span v-for="filter in filters" :key="filter.id">{{ filter.label }}</span>
    </div>
  </ExcludeFiltersWithNoResults>
</template>

<script>
  import { ExcludeFiltersWithNoResults } from '@empathyco/x-components/facets';

  export default {
    components: {
      ExcludeFiltersWithNoResults
    },
    data() {
      return {
        filters: [
          {
            // This is the only filter that will be removed.
            facetId: 'category',
            id: 'category:men',
            modelName: 'SimpleFilter',
            selected: false,
            callbackInfo: {},
            label: 'Men',
            value: 'category:men',
            totalResults: 0
          },
          {
            facetId: 'category',
            id: 'category:women',
            modelName: 'SimpleFilter',
            selected: false,
            callbackInfo: {},
            label: 'Women',
            value: 'category:women',
            totalResults: 10
          },
          {
            facetId: 'category',
            id: 'category:kids',
            modelName: 'SimpleFilter',
            selected: false,
            callbackInfo: {},
            label: 'Kids',
            value: 'category:kids',
            totalResults: undefined
          }
        ]
      };
    }
  };
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

<script>
  import {
    ExcludeFiltersWithNoResults,
    FiltersSearch,
    Filters,
    SimpleFilter
  } from '@empathyco/x-components/facets';

  export default {
    components: {
      ExcludeFiltersWithNoResults,
      FiltersSearch,
      Filters,
      SimpleFilter
    },
    data() {
      return {
        filters: [
          {
            // This is the only filter that will be removed.
            facetId: 'category',
            id: 'category:men',
            modelName: 'SimpleFilter',
            selected: false,
            callbackInfo: {},
            label: 'Men',
            value: 'category:men',
            totalResults: 0
          },
          {
            facetId: 'category',
            id: 'category:women',
            modelName: 'SimpleFilter',
            selected: false,
            callbackInfo: {},
            label: 'Women',
            value: 'category:women',
            totalResults: 10
          },
          {
            facetId: 'category',
            id: 'category:kids',
            modelName: 'SimpleFilter',
            selected: false,
            callbackInfo: {},
            label: 'Kids',
            value: 'category:kids',
            totalResults: undefined
          }
        ]
      };
    }
  };
</script>
```
</docs>
