<template>
  <component :is="animation" v-if="hasFacets" class="x-facets-list" data-test="facets" tag="ul">
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
        v-if="hasSlot(slotNameById)"
        v-bind="{
          facet,
          selectedFilters: selectedFiltersByFacet[facetId] || [],
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
        v-else-if="hasSlot(slotNameByModelName)"
        v-bind="{
          facet,
          selectedFilters: selectedFiltersByFacet[facetId] || [],
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
          selectedFilters: selectedFiltersByFacet[facetId] || [],
        }"
      >
        This is the {{ facet.label }} facet. Pass something into its slot to display content.
      </slot>
    </li>
  </component>
</template>

<script lang="ts">
import type { Facet } from '@empathyco/x-types'
import type { Dictionary } from '@empathyco/x-utils'
import type { PropType } from 'vue'
import { map, objectFilter } from '@empathyco/x-utils'
import { computed, defineComponent } from 'vue'
import { useGetter } from '../../../../composables/use-getter'
import { AnimationProp } from '../../../../types'
import { toKebabCase } from '../../../../utils/string'
import { useFacets } from '../../composables/use-facets'
import { facetsXModule } from '../../x-module'

/**
 * Custom interface to provide a slot name to a Facet.
 *
 * @internal
 */
interface RenderFacet {
  slotNameById: string
  slotNameByModelName: string
  facet: Facet
}

/**
 * This component renders the list of facets stored in the Facets module. Facets can be rendered
 * differently based on their purpose and this can be achieved using the exposed slots:
 * - A default and required slot.
 * - A custom slot for each facet with the facetId as its name. This allows each facet to be
 * rendered differently based on its needs.
 *
 * @public
 */
export default defineComponent({
  name: 'Facets',
  xModule: facetsXModule.name,
  props: {
    /** Array of facets ids used to get the selected filters for those facets. */
    facetsIds: Array as PropType<Array<Facet['id']>>,
    /** Flag to render the component even if there are no filters selected. */
    alwaysVisible: Boolean,
    /** Animation component that will be used to animate the facets. */
    animation: {
      type: AnimationProp,
      default: 'ul',
    },
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
     */
    renderableFacets: String,
  },
  setup(props, { slots }) {
    const { selectedFiltersByFacet } = useFacets(props)
    const { facets } = useGetter('facets')

    /**
     * The facets to be rendered after filtering {@link Facets.facets} by
     * {@link Facets.renderableFacets} content.
     *
     * @returns The list of facets to be rendered.
     */
    const facetsToRender = computed<Dictionary<Facet>>(() => {
      if (!props.renderableFacets) {
        return facets.value
      } else {
        const excludedRegExp = /^!/
        const facetIds: string[] = props.renderableFacets.split(',').map(facetId => facetId.trim())
        const included: string[] = []
        const excluded: string[] = []
        facetIds.forEach(facetId => {
          if (excludedRegExp.test(facetId)) {
            excluded.push(facetId.replace(excludedRegExp, ''))
          } else {
            included.push(facetId)
          }
        })

        return filterFacetsToRender(included, excluded)
      }
    })

    /**
     * Transforms a dictionary of Facets including the slot name.
     *
     * @returns A dictionary of facets with the slot name.
     */
    const mappedFacets = computed<Dictionary<RenderFacet>>(() => {
      return map(facetsToRender.value, (facetId, facet) => ({
        slotNameById: toKebabCase(facetId),
        slotNameByModelName: toKebabCase(facet.modelName),
        facet,
      }))
    })

    /**
     * Indicates if there are facets available to show.
     *
     * @returns True if there are facets available and false otherwise.
     */
    const hasFacets = computed<boolean>(() => !!Object.keys(facetsToRender.value).length)

    /**
     * Filter facets dictionary retrieving those included and/or removing excluded.
     *
     * @param included - List of facets to render.
     * @param excluded - List of not renderable facets.
     *
     * @returns The filtered list of facets to render.
     */
    function filterFacetsToRender(included: string[], excluded: string[]): Dictionary<Facet> {
      const hasAnyFacetIncluded = included.length > 0
      return objectFilter(facets.value, facetKey => {
        const isIncluded = included.includes(String(facetKey))
        const isExcluded = excluded.includes(String(facetKey))

        return hasAnyFacetIncluded ? isIncluded && !isExcluded : !isExcluded
      })
    }

    /**
     * Whether the slot is present in the template or not.
     *
     * @param name - The slot name.
     *
     * @returns True is the slot is present in the template. False otherwise.
     */
    function hasSlot(name: string): boolean {
      return !!slots[name]
    }

    return {
      selectedFiltersByFacet,
      hasFacets,
      mappedFacets,
      hasSlot,
    }
  },
})
</script>

<style lang="css" scoped>
.x-facets-list {
  display: flex;
  flex-flow: column nowrap;
  list-style-type: none;
}
</style>

<docs lang="mdx">
## Examples

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
      <h1>{{ facet.label }}</h1>
      <span v-if="selectedFilters.length > 0">{{ `${selectedFilters.length} selected` }}</span>

      <ul>
        <li v-for="filter in facet.filters" :key="filter.id">
          {{ filter.label }}
        </li>
      </ul>
    </template>
  </Facets>
</template>

<script setup>
import { Facets } from '@empathyco/x-components/facets'
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
          <ul v-for="childFilter in filter.children" :key="childFilter.id">
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

<script setup>
import { Facets } from '@empathyco/x-components/facets'
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

<script setup>
import { Facets } from '@empathyco/x-components/facets'
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

<script setup>
import { Facets } from '@empathyco/x-components/facets'
</script>
```

### Integrating with the filters components

There are many components that will help you build your own awesome filters list. `Facets` just
renders the list, but what to render for each facet is up to you. Below you can see an example of
the `Facets` component using the `FiltersSearch`, `MultiSelectFilters`, `SimpleFilter`, `Filters`,
`HierarchicalFilter`, `NumberRangeFilter` and `BasePriceFilterLabel` components.

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

<script setup>
import {
  Facets,
  Filters,
  FiltersSearch,
  HierarchicalFilter,
  MultiSelectFilters,
  NumberRangeFilter,
  SimpleFilter,
} from '@empathyco/x-components/facets'

import { BasePriceFilterLabel } from '@empathyco/x-components'
</script>
```
</docs>
