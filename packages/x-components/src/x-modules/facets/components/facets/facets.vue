<template>
  <component
    :is="animation"
    v-if="hasFacets"
    class="x-list x-facets-list"
    data-test="facets"
    tag="ul"
  >
    <li
      v-for="({ facet, slotNameById, slotNameByModelName }, facetId) in mappedFacets"
      :key="facetId"
      class="x-facets-list__item"
      data-test="facets-facet"
    >
      <!--
        @slot Customized Facet rendering. Specifying a slot with the facet's name will result in the
        facet using that slot composition to render.
            @binding {Facet} facet - Facet to render
            @binding {Filter[]} selectedFilters - List of selected filters of the given facet
      -->
      <slot
        v-if="$scopedSlots[slotNameById]"
        v-bind="{
          facet,
          selectedFilters: selectedFiltersByFacet[facetId] || []
        }"
        :name="slotNameById"
      />
      <!--
        @slot Customized Facet rendering. Specifying a slot with the facet's modelName will result
        in the facet using that slot composition to render.
            @binding {Facet} facet - Facet to render
            @binding {Filter[]} selectedFilters - List of selected filters of the given facet
      -->
      <slot
        v-else-if="$scopedSlots[slotNameByModelName]"
        v-bind="{
          facet,
          selectedFilters: selectedFiltersByFacet[facetId] || []
        }"
        :name="slotNameByModelName"
      />
      <!--
        @slot (required) Default Facet rendering. This slot will be used by default for rendering
        the facets without an specific slot implementation.
            @binding {Facet} facet - Facet to render
            @binding {Filter[]} selectedFilters - List of selected filters of the given facet
      -->
      <slot
        v-else
        v-bind="{
          facet,
          selectedFilters: selectedFiltersByFacet[facetId] || []
        }"
      >
        This is the {{ facet.label }} facet. Pass something into its slot to display content.
      </slot>
    </li>
  </component>
</template>

<script lang="ts">
  import { Facet } from '@empathyco/x-types';
  import { Dictionary, map, objectFilter } from '@empathyco/x-utils';
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import { Getter } from '../../../../components/decorators/store.decorators';
  import { xComponentMixin } from '../../../../components/x-component.mixin';
  import { toKebabCase } from '../../../../utils/string';
  import FacetsMixin from '../facets.mixin';
  import { facetsXModule } from '../../x-module';

  /**
   * Custom interface to provide a slot name to a Facet.
   *
   * @internal
   */
  interface RenderFacet {
    slotNameById: string;
    slotNameByModelName: string;
    facet: Facet;
  }

  /**
   * This component renders the list of facets stored in the Facets module. Facets can be rendered
   * differently based on their purpose and this can be achieved using the exposed slots:
   * - A default and required slot.
   * - A custom slot for each facet with the facetId as its name. This allows each facet to be
   * rendered differently based on its needs.
   *
   * @remarks It extends {@link FacetsMixin}.
   *
   * @public
   */
  @Component({
    mixins: [xComponentMixin(facetsXModule)]
  })
  export default class Facets extends FacetsMixin {
    /**
     * Animation component that will be used to animate the facets.
     *
     * @public
     */
    @Prop({ default: 'ul' })
    public animation!: Vue | string;

    /**
     * Discriminates the facets rendered by this component. It expects a string containing facets
     * ids, comma separated. This property will include or exclude facets based on its value.
     * The default value is an empty string and the component will render all existing facets.
     *
     * @remarks
     * To behave as a `include`, simply set the facets ids, comma separated:
     * `existingFacets=[{ brand: ... }, category: { ... }, color: { ... }, price: { ... }]`
     * `renderableFacets="brand, category"`
     *
     * The component will render brand and category facets.
     *
     * On the other hand, to simulate an `exclude` behaviour and exclude a facet from being
     * rendered, append a '!' before its id:
     * `existingFacets=[{ brand: ... }, category: { ... }, color: { ... }, price: { ... }]`
     * `renderableFacets="!brand,!price"`
     *
     * The component will render category and color facets.
     *
     * @public
     */
    @Prop()
    public renderableFacets!: string | undefined;

    /**
     * Dictionary of facets in the state.
     *
     * @internal
     */
    @Getter('facets', 'facets')
    public facets!: Record<Facet['id'], Facet>;

    /**
     * Transforms a dictionary of Facets including the slot name.
     *
     * @returns A dictionary of facets with the slot name.
     *
     * @internal
     */
    protected get mappedFacets(): Dictionary<RenderFacet> {
      return map(this.facetsToRender, (facetId, facet) => ({
        slotNameById: toKebabCase(facetId),
        slotNameByModelName: toKebabCase(facet.modelName),
        facet
      }));
    }

    /**
     * The facets to be rendered after filtering {@link Facets.facets} by
     * {@link Facets.renderableFacets} content.
     *
     * @returns The list of facets to be rendered.
     *
     * @internal
     */
    protected get facetsToRender(): Dictionary<Facet> {
      if (!this.renderableFacets) {
        return this.facets;
      } else {
        const excludedRegExp = /^!/;
        const facetIds: string[] = this.renderableFacets.split(',').map(facetId => facetId.trim());
        const included: string[] = [];
        const excluded: string[] = [];
        facetIds.forEach(facetId => {
          if (excludedRegExp.test(facetId)) {
            excluded.push(facetId.replace(excludedRegExp, ''));
          } else {
            included.push(facetId);
          }
        });

        return this.filterFacetsToRender(included, excluded);
      }
    }

    /**
     * Indicates if there are facets available to show.
     *
     * @returns True if there are facets available and false otherwise.
     * @internal
     */
    protected get hasFacets(): boolean {
      return !!Object.keys(this.facetsToRender).length;
    }

    /**
     * Filter facets dictionary retrieving those included and/or removing excluded.
     *
     * @param included - List of facets to render.
     * @param excluded - List of not renderable facets.
     *
     * @returns The filtered list of facets to render.
     *
     * @internal
     */
    private filterFacetsToRender(included: string[], excluded: string[]): Dictionary<Facet> {
      const hasAnyFacetIncluded = included.length > 0;
      return objectFilter(this.facets, facetKey => {
        const isIncluded = included.includes(String(facetKey));
        const isExcluded = excluded.includes(String(facetKey));

        return hasAnyFacetIncluded ? isIncluded && !isExcluded : !isExcluded;
      });
    }
  }
</script>

<style lang="scss" scoped>
  .x-facets-list {
    list-style-type: none;
  }
</style>

<docs lang="mdx">
## Example

This component renders the list of facets stored in the Facets module. Facets can be rendered
differently based on their purpose and this can be achieved using the exposed slots:

- A default and required slot.
- A custom slot for each facet with the facetId as its name. This allows each facet to be rendered
  differently based on its needs.

Below, there are some examples showing how to use the component with its different configurations.

### Default usage

The default slot of this component is mandatory. If no other slot is defined, every Facet will be
rendered as specified in the default slot.

```vue
<template>
  <Facets>
    <template #default="{ facet, selectedFilters }">
      <h1>{{ ${facet.label} }}</h1>
      <span v-if="selectedFilters.length > 0">{{ `${selectedFilters.length} selected` }}</span>

      <ul>
        <li v-for="filter in facet.filters" :key="filter.id">
          {{ filter.label }}
        </li>
      </ul>
    </template>
  </Facets>
</template>

<script>
  import { Facets } from '@empathyco/x-components/facets';

  export default {
    components: {
      Facets
    }
  };
</script>
```

### Customized usage

Customized compositions for a specific Facet can be achieved by using a slot with the same id as the
facet to customize. For example, the Facet with the id "color" requires a composition that differs
from the rest of the Facets. Doing it in a slot with the name "color" will apply this customization
just to the "color" Facet. The other facets will fallback to the composition of the default slot.

It is also possible to customize the Facet content by the facet "model name". For example, to
configure different content for "Hierarchical Facets" the "hierarchical-facet" slot will apply that
customization. This can be combined with the facets by facet id. If some hierarchical facet needs
some different customization from the rest of the hierarchical, it can be achieve using the slot
with the facet id.

```vue
<template>
  <Facets>
    <template #color="{ facet, selectedFilters }">
      <span v-if="selectedFilters.length > 0">{{ `${selectedFilters.length} colors chosen` }}</span>

      <ul v-for="filter in facet.filters" :key="filter.id">
        <li v-if="!filter.selected">
          {{ filter.label }}
        </li>
      </ul>
    </template>

    <template #hierarchical-facet="{ facet, selectedFilters }">
      <span v-if="selectedFilters.length > 0">{{ `${selectedFilters.length} colors chosen` }}</span>

      <ul v-for="filter in facet.filters" :key="filter.id">
        <li v-if="!filter.selected">
          {{ filter.label }}
          <ul v-for="childFilter in filter.children" :key="filter.id">
            <li v-if="!childFilter.selected">
              {{ childFilter.label }}
            </li>
          </ul>
        </li>
      </ul>
    </template>

    <template #default="{ facet }">
      <h1>{{ facet.label }}</h1>

      <ul>
        <li v-for="filter in facet.filters" :key="filter.id">
          {{ filter.label }}
        </li>
      </ul>
    </template>
  </Facets>
</template>

<script>
  import { Facets } from '@empathyco/x-components/facets';

  export default {
    components: {
      Facets
    }
  };
</script>
```

### Render specific facets I

By default, this component will render all existing facets. However, it has the renderableFacets
prop to filter which facets will be rendered. Its value is a string containing the different facets
ids. This value is treated as an include or exclude list (to exclude a facet from being rendered,
just prefix its id with a `!`). The component will only render included facets and discard excluded
ones. In the following example, the component will only render color and category facets.

```vue
<template>
  <Facets renderableFacets="color, category">
    <template #default="{ facet }">
      <h1>{{ facet.label }}</h1>

      <ul>
        <li v-for="filter in facet.filters" :key="filter.id">
          {{ filter.label }}
        </li>
      </ul>
    </template>
  </Facets>
</template>

<script>
  import { Facets } from '@empathyco/x-components/facets';

  export default {
    components: {
      Facets
    }
  };
</script>
```

### Render specific facets II

Exclude facets so the component does not render them. In the following example, the component will
render every facet except color and price.

```vue
<template>
  <Facets renderableFacets="!color, !price">
    <template #default="{ facet }">
      <h1>{{ facet.label }}</h1>

      <ul>
        <li v-for="filter in facet.filters" :key="filter.id">
          {{ filter.label }}
        </li>
      </ul>
    </template>
  </Facets>
</template>

<script>
  import { Facets } from '@empathyco/x-components/facets';

  export default {
    components: {
      Facets
    }
  };
</script>
```

### Integrating with the filters components

There are many components that will help you build your own awesome filters list. `Facets` just
renders the list, but what to render for each facet is up to you. Below you can see an example. of
the `Facets` component using the `FiltersSearch` `MultiSelectFilters`, `SimpleFilter`, `Filters`,
`HierarchicalFilter`, `NumberRangeFilter` and `BasePriceFilterLabel`.

```vue
<template>
  <Facets>
    <template #default="{ facet, selectedFilters }">
      <h1>{{ facet.label }}</h1>
      <FiltersSearch :filters="facet.filters">
        <MultiSelectFilters v-slot="{ filter }">
          <SimpleFilter :filter="filter" />
        </MultiSelectFilters>
      </FiltersSearch>
    </template>

    <template #category="{ facet }">
      <h1>{{ facet.label }}</h1>
      <Filters v-slot="{ filter }" :filters="facet.filters">
        <HierarchicalFilter :filter="filter" />
      </Filters>
    </template>

    <template #price="{ facet }">
      <h1>{{ facet.label }}</h1>
      <Filters v-slot="{ filter }" :filters="facet.filters">
        <NumberRangeFilter :filter="filter">
          <BasePriceFilterLabel :filter="filter" />
        </NumberRangeFilter>
      </Filters>
    </template>
  </Facets>
</template>

<script>
  import {
    Facets,
    Filters,
    FiltersSearch,
    HierarchicalFilter,
    MultiSelectFilters,
    NumberRangeFilter,
    SimpleFilter
  } from '@empathyco/x-components/facets';

  import { BasePriceFilterLabel } from '@empathyco/x-components';

  export default {
    components: {
      Facets,
      MultiSelectFilters,
      FiltersSearch,
      SimpleFilter,
      Filters,
      HierarchicalFilter,
      NumberRangeFilter,
      BasePriceFilterLabel
    }
  };
</script>
```
</docs>
