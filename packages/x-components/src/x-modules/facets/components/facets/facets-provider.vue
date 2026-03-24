<script lang="ts">
import type { Facet, Filter } from '@empathyco/x-types'
import type { PropType, Ref } from 'vue'
import type { GroupId } from '../../store/types'
import { isHierarchicalFacet } from '@empathyco/x-types'
import { computed, defineComponent, ref, watch } from 'vue'
import { use$x } from '../../../../composables/use-$x'
import { clone } from '../../../../utils'
import { areFiltersDifferent } from '../../../../utils/filters'
import { flatHierarchicalFilters } from '../../utils'
import { facetsXModule } from '../../x-module'

/**
 * This component allows to provide facets by prop, to add them to the state of the
 * `Facets X-Module`. These facets will be added to the `Facets X-Module` state together with
 * the facets emitted by the `Search X-Module` through the {@link SearchXEvents.FacetsChanged}
 * event.
 *
 * @public
 */
export default defineComponent({
  name: 'FacetsProvider',
  xModule: facetsXModule.name,
  props: {
    /**
     * An facet group identifier to distinguish the provided facets from other facets like the
     * `Search X-Module` facets.
     *
     * @public
     */
    groupId: {
      type: String as PropType<GroupId>,
      default: 'provided-facets',
    },
    /**
     * The facets to provide to the `Facets X-Module` state. They have to include the
     * {@link @empathyco/x-types#Filter}.
     *
     * @internal
     */
    facets: {
      type: Array as PropType<Facet[]>,
      required: true,
    },
  },
  setup(props) {
    const $x = use$x()

    /**
     * Temporarily stores the selected filters from the {@link FacetsProvider.facets} prop.
     * This is necessary to handle the {@link FacetsXEvents.UserChangedSelectedFilters} event.
     *
     * @internal
     */
    const selectedFilters: Ref<Filter[] | null> = ref(null)

    /**
     * A computed property to group the facets and the groupId. This is used by the watcher.
     *
     * @returns The FacetGroup with the facets and the group id.
     *
     * @internal
     */
    const facetsGroup = computed(() => ({ id: props.groupId, facets: props.facets }))

    /**
     * Emits the {@link FacetsXEvents.UserChangedSelectedFilters} event when the user changes
     * the selected filters.
     *
     * @param selectedFilters - The new list of selected filters.
     * @internal
     */
    $x.on('SelectedFiltersChanged', false).subscribe((selectedFiltersParams: Filter[]) => {
      if (
        selectedFilters.value === null ||
        areFiltersDifferent(selectedFilters.value, selectedFiltersParams)
      ) {
        $x.emit('UserChangedSelectedFilters', selectedFiltersParams)
      }
      selectedFilters.value = null
    })

    /**
     * Extracts the selected filters from the facets and stores them in the
     * {@link FacetsProvider.selectedFilters} property.
     *
     * @param facets - The facets from whom extract the selected filters.
     * @internal
     */
    const extractSelectedFilters = (facets: Facet[]) => {
      selectedFilters.value = facets
        .flatMap(facet =>
          isHierarchicalFacet(facet) ? flatHierarchicalFilters(facet.filters) : facet.filters,
        )
        .filter(filter => filter.selected)
    }

    /**
     * Emits the {@link FacetsXEvents.FacetsGroupProvided} event with the
     * {@link FacetsProvider.facetsGroup} as payload. It also extracts and saves the selected
     * filters.
     */
    watch(
      () => facetsGroup.value,
      () => {
        if (facetsGroup.value.facets) {
          const facetsGroupClone = clone(facetsGroup.value)
          $x.emit('FacetsGroupProvided', facetsGroupClone)
          extractSelectedFilters(props.facets)
        }
      },
      { immediate: true },
    )

    return () => ''
  },
})
</script>

<style lang="css" scoped>
.x-facets-list {
  list-style-type: none;
}
</style>

<docs lang="mdx">
## Events

A list of events that the component will emit:

- [`UserChangedSelectedFilters`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts):
  the event is emitted after the user performed an action that changed the selected filters. The
  payload is the new list of selected filters.
- [`FacetsGroupProvided`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts):
  the event is emitted after updating the facets prop with a new list of facets. The payload
  contains a Facets Group with the facets and the group id.

## Example

This component allows to provide facets by prop, to add them to the state of the `Facets X-Module`.
These facets will be added to the `Facets X-Module` state together with the facets emitted by the
`Search X-Module` through the `SearchXEvents.FacetsChanged` event.

```vue
<template>
  <FacetsProvider :facets="myFacets" />
</template>

<script setup>
import { FacetsProvider } from '@empathyco/x-components/facets'
import { ref } from 'vue'

const myFacets = ref([
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
        totalResults: 10,
      },
      {
        modelName: 'SimpleFilter',
        id: 'color:blue',
        facetId: 'color-facet',
        label: 'Blue',
        selected: false,
        value: 'color:blue',
        totalResults: 10,
      },
    ],
  },
])
</script>
```
</docs>
