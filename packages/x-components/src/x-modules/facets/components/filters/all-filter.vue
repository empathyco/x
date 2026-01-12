<template>
  <BaseEventButton
    class="xds:facet-filter x-all-filter"
    data-test="all-filter"
    role="checkbox"
    :aria-checked="isSelected.toString()"
    :events="clickEvent"
    :class="cssClasses"
  >
    <!--
        @slot The content to render inside the button
            @binding {Facet} Facet - The facet data
      -->
    <slot :facet="facet" :is-selected="isSelected">all</slot>
  </BaseEventButton>
</template>

<script lang="ts">
import type { Facet } from '@empathyco/x-types'
import type { PropType } from 'vue'
import type { XEventsTypes } from '../../../../wiring/events.types'
import { computed, defineComponent } from 'vue'
import BaseEventButton from '../../../../components/base-event-button.vue'
import { useGetter } from '../../../../composables/use-getter'
import { isArrayEmpty } from '../../../../utils/array'
import { facetsXModule } from '../../x-module'

/**
 * This component receives a required `facet` with
 * {@link @empathyco/x-types#BooleanFilter} as prop and renders a button, which
 * on clicked emits the {@link FacetsXEvents.UserClickedAllFilter} event. By default
 * the rendered button displays a message with the facet label but this content is customizable
 * through the default slot.
 *
 * @public
 */
export default defineComponent({
  name: 'AllFilter',
  components: {
    BaseEventButton,
  },
  xModule: facetsXModule.name,
  props: {
    /** The facet data. */
    facet: {
      type: Object as PropType<Facet>,
      required: true,
    },
  },
  setup(props) {
    /** The getter of the selectedFiltersByFacet. */
    const { selectedFiltersByFacet } = useGetter('facets')

    /**
     * The event that will be emitted when the all filter button is clicked.
     *
     * @returns The event to emit on click.
     * @internal
     */
    const clickEvent = computed((): Partial<XEventsTypes> => {
      return { UserClickedAllFilter: [props.facet.id] }
    })

    /**
     * Computed to retrieve the selected state of this component.
     *
     * @returns True if is selected false otherwise.
     */
    const isSelected = computed(() => {
      return isArrayEmpty(selectedFiltersByFacet.value?.[props.facet.id])
    })

    /**
     * Dynamic CSS classes to apply to the component.
     *
     * @remarks This is only valid considering that in the case of HierarchicalFilters, ancestors
     * of nested selected filters are also selected.
     *
     * @returns The dynamic CSS classes to apply to the component.
     * @internal
     */
    const cssClasses = computed(() => {
      return {
        'xds:selected x-all-filter--is-selected': isSelected.value,
      }
    })

    return {
      clickEvent,
      cssClasses,
      isSelected,
    }
  },
})
</script>

<docs lang="mdx">
## Events

A list of events that the component will emit:

- [`UserClickedAllFilter`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts):
  the event is emitted after the user clicks the button. The event payload is the id of the facet
  that this `AllFilter` component corresponds to.

## Examples

This component receives a required `facet` as prop and renders a button, which on clicked emits the
UserClickedAllFilter event. By default the rendered button displays a message with the facet label
but this content is customizable through the default slot.

### Basic usage

```vue
<AllFilter :facet="facet" />
```

### Customizing its content

```vue
<AllFilter v-slot="{ facet }" :facet="facet">
  Select all {{ facet.label }}
</AllFilter>
```

### Basic example within facets

```vue
<Facets>
  <template #default="{ facet }">
    <AllFilter :facet="facet" />
    <Filters v-slot="{ filter }" :filters="facet.filters">
      <SimpleFilter :filter="filter" />
    </Filters>
  </template>
</Facets>
```

### Custom example within facets

```vue
<Facets>
  <template #default="{ facet }">
    <AllFilter v-slot="{ facet }" :facet="facet">
      Select all {{ facet.label }}
    </AllFilter>
    <Filters v-slot="{ filter }" :filters="facet.filters">
      <SimpleFilter :filter="filter" />
    </Filters>
  </template>
</Facets>
```
</docs>
