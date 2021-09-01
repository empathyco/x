<template>
  <NoElement v-if="show" class="x-selected-filters">
    <slot v-bind="{ selectedFilters }">{{ selectedFilters.length }}</slot>
  </NoElement>
</template>

<script lang="ts">
  import { Facet, Filter } from '@empathyco/x-types';
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import { Getter, NoElement, xComponentMixin } from '../../../../components';
  import { FiltersByFacet } from '../../store/types';
  import { facetsXModule } from '../../x-module';

  /**
   * Provides a scoped slot with the selected filters from every facet, or from the facet which
   * facet id is passed as property.
   *
   * The default slot renders the length of the selected filters array.
   * The property "alwaysVisible" handles if the component is rendered if no filters are selected.
   *
   * @public
   */
  @Component({
    mixins: [xComponentMixin(facetsXModule)],
    components: {
      NoElement
    }
  })
  export default class SelectedFilters extends Vue {
    /**
     * If a facet id is passed as prop, the component filters the selected filters for that facet.
     *
     * @public
     */
    @Prop()
    protected facetId: Facet['id'] | undefined;

    /**
     * It handles if the SelectedFilters component is always rendered no matter if no filters are
     * selected.
     * If true, the SelectedFilters component is always rendered.
     * If false, the SelectedFilters component is not rendered whether no filters are selected.
     *
     * @public
     */
    @Prop({ default: false })
    protected alwaysVisible!: boolean;

    /**
     * Array of selected filters from every facet.
     *
     * @public
     */
    @Getter('facets', 'selectedFilters')
    public selectedFiltersGetter!: Filter[];

    /**
     * Dictionary of selected filters grouped by facet.
     *
     * @public
     */
    @Getter('facets', 'selectedFiltersByFacet')
    public selectedFiltersByFacet!: FiltersByFacet;

    /**
     * It returns an array of selected filters. If a facet id is passed as prop to the component,
     * only the selected filters of that facet are returned. If not, it returns selected filters of
     * every facet.
     *
     * @returns Array of selected filters.
     *
     * @internal
     */
    protected get selectedFilters(): Filter[] {
      return this.facetId === undefined
        ? this.selectedFiltersGetter
        : this.selectedFiltersByFacet[this.facetId] ?? [];
    }

    /**
     * If "alwaysVisible" prop is true, returns true.
     * If "alwaysVisible" prop is false, returns true or false depending on if there are some
     * filter selected.
     *
     * @returns True if "alwaysVisible" is true. True or false depending on if there are some filter
     * selected.
     *
     * @internal
     */
    protected get show(): boolean {
      return this.alwaysVisible || this.selectedFilters.length > 0;
    }
  }
</script>

<docs lang="mdx">
#Example

Provides a scoped slot with the selected filters from every facet, or from the facet which facet id
is passed as property.

The default slot renders the length of the selected filters array.

## Basic usage

```vue
<SelectedFilters />
```

## Always visible

If "alwaysVisible" is true, the component is rendered no matter if there are some filter selected.
If "alwaysVisible" is false (default), the component is rendered if there are some filter selected.

```vue
<SelectedFilters />
```

Output:

```html
<div class="x-selected-filters">1</div>
```

## Customizing its content

In this example, renders a custom message using the default scoped slot.

```vue
<SelectedFilters>
  <template #default="{ selectedFilters }">
    Selected filters: {{ selectedFilters.length }}
  </template>
</SelectedFilters>
```

Output:

```html
<div class="x-selected-filters">Selected filters: 1</div>
```

In this example, the selected filters computed are the ones that match the facet passed as property.

```vue
<SelectedFilters facetId="brand_facet" />
```

```vue
<SelectedFilters facetId="brand_facet">
  <template #default="{ selectedFilters }">
    Selected filters: {{ selectedFilters.length }}
  </template>
</SelectedFilters>
```
</docs>
