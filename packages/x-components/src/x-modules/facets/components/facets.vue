<template>
  <component :is="animation" v-if="hasFacets" class="x-facets-list" data-test="facets" tag="ul">
    <li
      v-for="(facet, facetId) in facetsToRender"
      :key="facetId"
      class="x-facets-list__item"
      data-test="facets-facet"
    >
      <!--
        @slot Customized Facet rendering. Specifying a slot with the facet's name will result in the
        facet using that slot composition to render.
            @binding {Facet} facet - Facet to render
      -->
      <slot
        v-if="$scopedSlots[facetId]"
        v-bind="{ facet, selectedFilters: selectedFiltersByFacet[facetId] }"
        :name="facetId"
      />
      <!--
        @slot (required) Default Facet rendering. This slot will be used by default for rendering
        the facets without an specific slot implementation.
            @binding {Facet} facet - Facet to render
      -->
      <slot v-else v-bind="{ facet, selectedFilters: selectedFiltersByFacet[facetId] }">
        This is the {{ facet.label }} facet. Pass something into its slot to display content.
      </slot>
    </li>
  </component>
</template>

<script lang="ts">
  import { Facet, Filter } from '@empathy/search-types';
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import { XOn } from '../../../components';
  import { Getter } from '../../../components/decorators/store.decorators';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { clone } from '../../../utils/clone';
  import { extractFilters, isFilterSelected } from '../../../utils/filters';
  import { objectFilter } from '../../../utils/object';
  import { Dictionary } from '../../../utils/types';
  import { FiltersByFacet } from '../store/types';
  import { areFiltersDifferent } from '../utils';
  import { facetsXModule } from '../x-module';

  /**
   * This component renders the list of facets stored in the Facets module. This facets can be set
   * either emitting the `BackendFacetsChanged` and/or `FrontendFacetsChanged` events, or by using
   * the `backendFacets` and/or `frontendFacets` props. Facets can be rendered differently based on
   * their purpose and this can be achieved using the exposed slots:
   * - A default and required slot.
   * - A custom slot for each facet with the facetId as its name. This allows each facet to be
   * rendered differently based on its needs.
   *
   * @public
   */
  @Component({
    mixins: [xComponentMixin(facetsXModule)]
  })
  export default class Facets extends Vue {
    /**
     * Animation component that will be used to animate the facets.
     *
     * @public
     */
    @Prop({ default: 'ul' })
    public animation!: Vue | string;
    /**
     * If this prop is provided, these facets are used, and stored in the
     * {@link FacetsState.backendFacets}.
     *
     * @public
     */
    @Prop()
    public backendFacets?: Facet[];
    /**
     * If this prop is provided, these facets are used, and stored in the
     * {@link FacetsState.frontendFacets}. These facets state will be managed solely in the
     * frontend.
     *
     * @public
     */
    @Prop()
    public frontendFacets?: Facet[];
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
    @Prop({ default: '' })
    public renderableFacets!: string;
    /**
     * Array of selected filters from every facet.
     *
     * @internal
     */
    @Getter('facets', 'selectedFiltersByFacet')
    public selectedFiltersByFacet!: FiltersByFacet;
    /**
     * Dictionary of facets grouping backend and frontend facets.
     *
     * @internal
     */
    @Getter('facets', 'facets')
    public stateFacets!: Dictionary<Facet>;
    /**
     * Temporarily stores the selected filters from the {@link Facets.backendFacets} prop.
     *
     * @internal
     */
    protected selectedFilters: Filter[] | null = null;

    /**
     * The facets to be rendered after filtering {@link Facets.stateFacets} by
     * {@link Facets.renderableFacets} content.
     *
     * @returns The list of facets to be rendered.
     *
     * @internal
     */
    protected get facetsToRender(): Dictionary<Facet> {
      if (this.renderableFacets === '') {
        return this.stateFacets;
      }

      const excludedRegExp = /^!/;
      const emptySpaceRegex = /\s/g;
      const facetIds: string[] = this.renderableFacets.replace(emptySpaceRegex, '').split(',');
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
     * Creates a watcher for the `backendFacets` and `frontendFacets`, if they're set, emitting an
     * event whenever they change. This is done this way because the {@link XBus} is not injected
     * until the component is created.
     *
     * @internal
     */
    protected created(): void {
      if (this.backendFacets) {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        this.$watch('backendFacets', this.extractSelectedFilters, { immediate: true });
        // eslint-disable-next-line @typescript-eslint/unbound-method
        this.$watch('backendFacets', this.emitBackendFacetsProvided, { immediate: true });
      }

      if (this.frontendFacets) {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        this.$watch('frontendFacets', this.emitFrontendFacetsChanged, { immediate: true });
      }
    }

    /**
     * Emits the {@link FacetsXEvents.UserChangedSelectedFilters} event when the user changes
     * the selected filters.
     *
     * @param selectedFilters - The new list of selected filters.
     * @internal
     */
    @XOn('SelectedFiltersChanged')
    emitSelectedFiltersChanged(selectedFilters: Filter[]): void {
      if (
        this.selectedFilters === null ||
        areFiltersDifferent(this.selectedFilters, selectedFilters)
      ) {
        this.$x.emit('UserChangedSelectedFilters', selectedFilters);
      }
      this.selectedFilters = null;
    }

    /**
     * Handler for the `backendFacets` prop watcher. Emits
     * {@link FacetsXEvents.BackendFacetsChanged} event when facets change.
     *
     * @param newFacets - The list of new facets.
     *
     * @internal
     */
    protected emitBackendFacetsProvided(newFacets: Facet[]): void {
      this.$x.emit('BackendFacetsProvided', clone(newFacets));
    }

    /**
     * Handler for the `frontendFacets` prop watcher. Emits
     * {@link FacetsXEvents.FrontendFacetsChanged} event when facets change.
     *
     * @param newFacets - The list of new facets.
     *
     * @internal
     */
    protected emitFrontendFacetsChanged(newFacets: Facet[]): void {
      this.$x.emit('FrontendFacetsChanged', clone(newFacets));
    }

    /**
     * Extracts the selected filters from the facets and stores them in the
     * {@link Facets.selectedFilters} property.
     *
     * @param facets - The facets from whom extract the selected filters.
     * @internal
     */
    protected extractSelectedFilters(facets: Facet[]): void {
      this.selectedFilters = extractFilters(facets).filter(isFilterSelected);
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
      return objectFilter(this.stateFacets, facetKey => {
        const isIncluded = included.includes(facetKey);
        const isExcluded = excluded.includes(facetKey);

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
# Example

This component renders the list of facets stored in the Facets module. This facets can be set either
emitting the `BackendFacetsChanged` and/or `FrontendFacetsChanged` events, or by using the
`backendFacets` and/or `frontendFacets` props. Facets can be rendered differently based on their
purpose and this can be achieved using the exposed slots:

- A default and required slot.
- A custom slot for each facet with the facetId as its name. This allows each facet to be rendered
  differently based on its needs.

Below, there are some examples showing how to use the component with its different configurations.

## Default usage

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
  import { Facets } from '@empathy/x-components/facets';

  export default {
    components: {
      Facets
    }
  };
</script>
```

## Customized usage

Customized compositions for a specific Facet can be achieved by using a slot with the same id as the
facet to customize. For example, the Facet with the id "color" requires a composition that differs
from the rest of the Facets. Doing it in a slot with the name "color" will apply this customization
just to the "color" Facet. The other facets will fallback to the composition of the default slot.

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
  import { Facets } from '@empathy/x-components/facets';

  export default {
    components: {
      Facets
    }
  };
</script>
```

## Rendering custom facets data

By default, this component is integrated with the search module. This means that if the search
module stores some facets, they will be synced with the facets module, and rendered. But if you
don't want to use the search module, and you want to provide with your own facets data you also can.
To do so, pass an array of facets using the `facets` prop.

```vue
<template>
  <Facets v-slot="{ facet }" :backendFacets="backendFacets">
    <h1>{{ facet.label }}</h1>
    <ul>
      <li v-for="filter in facet.filters" :key="filter.id">
        {{ filter.label }}
      </li>
    </ul>
  </Facets>
</template>

<script>
  import { Facets } from '@empathy/x-components/facets';

  export default {
    components: {
      Facets
    },
    data() {
      return {
        backendFacets: [
          {
            modelName: 'SimpleFacet',
            id: 'color-facet',
            label: 'Color',
            filters: [
              {
                modelName: 'SimpleFilter',
                id: 'color:red',
                facetId: 'color-facet',
                label: 'Red',
                selected: false,
                value: 'color:red',
                totalResults: 10
              },
              {
                modelName: 'SimpleFilter',
                id: 'color:blue',
                facetId: 'color-facet',
                label: 'Blue',
                selected: false,
                value: 'color:blue',
                totalResults: 10
              }
            ]
          }
        ]
      };
    }
  };
</script>
```

## Rendering custom facets data II

In case you want to have some facets synced with the search module but some others to be totally
independent, you can use the `frontendFacets` prop.

```vue
<template>
  <Facets v-slot="{ facet }" :backendFacets="backendFacets" :frontendFacets="frontendFacets">
    <h1>{{ facet.label }}</h1>
    <ul>
      <li v-for="filter in facet.filters" :key="filter.id">
        {{ filter.label }}
      </li>
    </ul>
  </Facets>
</template>

<script>
  import { Facets } from '@empathy/x-components/facets';

  export default {
    components: {
      Facets
    },
    data() {
      return {
        backendFacets: [
          {
            modelName: 'SimpleFacet',
            id: 'color-facet',
            label: 'Color',
            filters: [
              {
                modelName: 'SimpleFilter',
                id: 'color:red',
                facetId: 'color-facet',
                label: 'Red',
                selected: false,
                value: 'color:red',
                totalResults: 10
              },
              {
                modelName: 'SimpleFilter',
                id: 'color:blue',
                facetId: 'color-facet',
                label: 'Blue',
                selected: false,
                value: 'color:blue',
                totalResults: 10
              }
            ]
          }
        ],
        frontendFacets: [
          {
            modelName: 'SimpleFacet',
            id: 'size-facet',
            label: 'Size',
            filters: [
              {
                modelName: 'SimpleFilter',
                id: 'size:s',
                facetId: 'size-facet',
                label: 'S',
                selected: false,
                value: 'size:s',
                totalResults: 10
              },
              {
                modelName: 'SimpleFilter',
                id: 'size:m',
                facetId: 'size-facet',
                label: 'M',
                selected: false,
                value: 'size:m',
                totalResults: 17
              },
              {
                modelName: 'SimpleFilter',
                id: 'size:l',
                facetId: 'size-facet',
                label: 'L',
                selected: false,
                value: 'size:l',
                totalResults: 13
              },
              {
                modelName: 'SimpleFilter',
                id: 'size:xl',
                facetId: 'size-facet',
                label: 'XL',
                selected: false,
                value: 'size:xl',
                totalResults: 5
              }
            ]
          }
        ]
      };
    }
  };
</script>
```

## Render specific facets I

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
  import { Facets } from '@empathy/x-components/facets';

  export default {
    components: {
      Facets
    }
  };
</script>
```

## Render specific facets II

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
  import { Facets } from '@empathy/x-components/facets';

  export default {
    components: {
      Facets
    }
  };
</script>
```

## Integrating with the filters components

There are many components that will help you build your own awesome filters list. `Facets` just
renders the list, but what to render for each facet is up to you. Below you can see an example. of
the `Facets` component using the `FiltersSearch` `MultiSelectFilters`, `SimpleFilter`, `Filters`,
`HierarchicalFilter`, `NumberRangeFilter` and `BasePriceFilterLabel`.

```vue
<template>
  <Facets>
    <template #default="{ facet, selectedFilters }">
      <h1>{{ facet.label }}</h1>
      <FiltersSearch v-slot="{ siftedFilters }" :filters="facet.filters">
        <MultiSelectFilters v-slot="{ filter }" :filters="siftedFilters">
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
        <NumberRangeFilter v-slot="{ filter }" :filter="filter">
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
  } from '@empathy/x-components/facets';

  import { BasePriceFilterLabel } from '@empathy/x-components';

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

## Events

A list of events that the component will emit:

- `UserChangedSelectedFilters`: the event is emitted after the user performed an action that changed
  the selected filters. The payload is the new list of selected filters.
- `BackendFacetsProvided`: the event is emitted after updating the backendFacets prop with a new
  list of facets. The payload contains a copy of the backendFacets prop.
- `FrontendFacetsProvided`: the event is emitted after updating the frontendFacets prop with a new
  list of facets. The payload contains a copy of the frontendFacets prop.
</docs>
