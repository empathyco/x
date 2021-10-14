<template>
  <SelectedFilters v-slot="{ selectedFilters }" :facetId="facetId" :alwaysVisible="alwaysVisible">
    <component
      :is="animation"
      class="x-list x-selected-filters-list"
      data-test="selected-filters-list"
      tag="ul"
    >
      <li
        v-for="{ slotName, selectedFilter } in mapSlot(selectedFilters)"
        :key="selectedFilter.id"
        class="x-selected-filters-list__item"
        data-test="selected-filters-list-item"
      >
        <!--
          @slot Custom filter rendering. Dynamic slot defined in the template with the filter
          facet id. It renders the filter label by default.
              @binding {Filter} filter - Filter to render.
        -->
        <slot v-if="$scopedSlots[slotName]" :name="slotName" :filter="selectedFilter">
          <span class="x-tag">{{ selectedFilter.label }}</span>
        </slot>

        <!--
          @slot Default filter rendering. It renders the filter label by default.
              @binding {Filter} filter - Filter to render.
        -->
        <slot v-else name="default" :filter="selectedFilter">
          {{ selectedFilter.label }}
        </slot>
      </li>
    </component>
  </SelectedFilters>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import { Facet, Filter, isFacetFilter } from '@empathyco/x-types';
  import { xComponentMixin } from '../../../../components/x-component.mixin';
  import { toKebabCase } from '../../../../utils/string';
  import { facetsXModule } from '../../x-module';
  import SelectedFilters from './selected-filters.vue';

  /**
   * Custom interface to provide a slot name to a Filter.
   *
   * @internal
   */
  interface RenderFilter {
    slotName: string;
    selectedFilter: Filter;
  }

  /**
   * This component renders a list of selected filters from every facet, or from the facet
   * which facet id is passed as property. It uses the SelectedFilters component (state).
   *
   * It provides two slots: a scoped one which name is the filter facet id; and a default one.
   * Both exposes the filter and renders the filter label by default.
   *
   * The property "alwaysVisible" handles if the component is rendered if no filters are selected.
   *
   * @public
   */
  @Component({
    components: { SelectedFilters },
    mixins: [xComponentMixin(facetsXModule)]
  })
  export default class SelectedFiltersList extends Vue {
    /**
     * It is directly passed to the selected filters component. If a facet id is passed as prop,
     * the component filters the selected filters for that facet.
     *
     * @public
     */
    @Prop()
    protected facetId: Facet['id'] | undefined;

    /**
     * It is directly passed to the selected filters component. It handles if the SelectedFilters
     * component is always rendered no matter if no filters are selected.
     *
     * If true, the SelectedFilters component is always rendered.
     * If false, the SelectedFilters component is not rendered whether no filters are selected.
     *
     * @public
     */
    @Prop({ default: false })
    protected alwaysVisible!: boolean;

    /**
     * Animation component that will be used to animate the selected filters list.
     *
     * @public
     */
    @Prop({ default: 'ul' })
    protected animation!: Vue | string;

    /**
     * Transforms a dictionary of Filters including the slot name.
     *
     * @param selectedFilters - A list of selected filters without slot name.
     *
     * @returns A dictionary of facets with the slot name.
     *
     * @internal
     */
    protected mapSlot(selectedFilters: Filter[]): RenderFilter[] {
      return selectedFilters.map(filter => ({
        slotName: isFacetFilter(filter) ? toKebabCase(filter.facetId as string) : 'default',
        selectedFilter: filter
      }));
    }
  }
</script>

<docs lang="mdx">
# Example

This component renders a list of selected filters from every facet, or from the facet which facet id
is passed as property. It uses the SelectedFilters component (state).

It provides two slots: a scoped one which name is the filter facet id; and a default one. Both
exposes the filter and renders the filter label by default.

The property "alwaysVisible" handles if the component is rendered if no filters are selected.

## Default usage

```vue
<template>
  <SelectedFiltersList />
</template>

<script>
  import { SelectedFiltersList } from '@empathyco/x-components/facets';

  export default {
    components: {
      SelectedFiltersList
    }
  };
</script>
```

## Customized usage

```vue
<template>
  <SelectedFiltersList #default="{ filter }">Default: {{ filter.label }}</SelectedFiltersList>
</template>

<script>
  import { SelectedFilters } from '@empathyco/x-components/facets';

  export default {
    components: {
      SelectedFilters
    }
  };
</script>
```

```vue
<template>
  <SelectedFiltersList>
    <template #default="{ filter }">Default: {{ filter.label }}</template>
    <template #brand_facet="{ filter }">Brand: {{ filter.label }}</template>
    <template #age_facet="{ filter }">Age: {{ filter.label }}</template>
    <template #price_facet="{ filter }">Price: {{ filter.label }}</template>
  </SelectedFiltersList>
</template>

<script>
  import { SelectedFilters } from '@empathyco/x-components/facets';

  export default {
    components: {
      SelectedFilters
    }
  };
</script>
```

## Always visible

If "alwaysVisible" is true, the component is rendered no matter if there are some filter selected.
If "alwaysVisible" is false (default), the component is rendered if there are some filter selected.

```vue
<SelectedFiltersList :alwaysVisible="true" />
```

Output:

```html
<div class="x-selected-filters">
  <ul class="x-selected-filters-list" data-test="selected-filters-list"></ul>
</div>
```

## Providing a facet id

In this example, the selected filters computed are the ones that match the facet passed as property.

```vue
<SelectedFilters facetId="brand_facet" />
```
</docs>
