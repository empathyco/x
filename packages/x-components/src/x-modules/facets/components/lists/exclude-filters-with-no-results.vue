<script lang="ts">
  import { BooleanFilter } from '@empathy/search-types';
  import Vue, { CreateElement, VNode } from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { xComponentMixin } from '../../../../components';
  import { facetsXModule } from '../../x-module';

  /**
   * The `ExcludeFiltersWithNoResults` component filters the provided list of filter, excluding
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
  export default class ExcludeFiltersWithNoResults extends Vue {
    /**
     * The list of filters to be rendered.
     *
     * @public
     */
    @Prop({ required: true })
    public filters!: BooleanFilter[];

    /**
     * Removes the filters that have exactly 0 results associated.
     *
     * @returns A sublist of the filters prop, excluding the ones with no results.
     * @internal
     */
    protected get filtersWithResults(): BooleanFilter[] {
      return this.filters.filter(filter => filter.totalResults !== 0);
    }

    render(h: CreateElement): VNode {
      return this.$scopedSlots.default?.({ filters: this.filtersWithResults })?.[0] ?? h();
    }
  }
</script>

<docs lang="mdx">
# ExcludeFiltersWithNoResults

The `ExcludeFiltersWithNoResults` component filters the provided list of filter, excluding those
which have the `totalResults` property exactly equal to `0`. It won't remove filters with no
`totalResults` property.

The new list of filters is bound to the default scoped slot. As this component does not render no
root element, this default slot must contain a single root node.

## Example

```vue
<template>
  <ExcludeFiltersWithNoResults v-slot="{ filters }" :filters="filters">
    <div>
      <span v-for="filter in filters" :key="filter.id">{{ filter.label }}</span>
    </div>
  </ExcludeFiltersWithNoResults>
</template>

<script>
  import { ExcludeFiltersWithNoResults } from '@empathy/x-components/facets';

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
</docs>
