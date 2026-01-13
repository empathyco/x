<template>
  <BaseEventButton
    v-if="isVisible"
    class="x-clear-filters xds:button"
    data-test="clear-filters"
    :disabled="!hasSelectedFilters"
    :events="events"
    :class="cssClasses"
  >
    <slot :selected-filters="selectedFilters">Clear Filters ({{ selectedFilters.length }})</slot>
  </BaseEventButton>
</template>

<script lang="ts">
import type { Facet } from '@empathyco/x-types'
import type { PropType } from 'vue'
import type { VueCSSClasses } from '../../../utils/types'
import type { XEventsTypes } from '../../../wiring/events.types'
import { computed, defineComponent } from 'vue'
import BaseEventButton from '../../../components/base-event-button.vue'
import { useFacets } from '../composables/use-facets'
import { facetsXModule } from '../x-module'

/**
 * Renders a simple button, emitting the needed events when clicked.
 *
 * @public
 */
export default defineComponent({
  name: 'ClearFilters',
  xModule: facetsXModule.name,
  components: { BaseEventButton },
  props: {
    /** Array of facets ids used to get the selected filters for those facets. */
    facetsIds: Array as PropType<Array<Facet['id']>>,
    /** Flag to render the component even if there are no filters selected. */
    alwaysVisible: Boolean,
  },
  setup(props) {
    const { selectedFilters, hasSelectedFilters, isVisible } = useFacets(props)

    /**
     * The events that will be emitted when the button clear filters is clicked.
     *
     * @returns The events to be emitted when the button clear filters is clicked.
     */
    const events = computed<Partial<XEventsTypes>>(() => ({
      UserClickedClearAllFilters: props.facetsIds,
    }))

    /**
     * Dynamic CSS classes to apply to the component.
     *
     * @returns The dynamic CSS classes to apply to the component.
     */
    const cssClasses = computed<VueCSSClasses>(() => ({
      'x-clear-filters--has-not-selected-filters': !hasSelectedFilters.value,
      'x-clear-filters--has-selected-filters': hasSelectedFilters.value,
    }))

    return {
      selectedFilters,
      hasSelectedFilters,
      isVisible,
      events,
      cssClasses,
    }
  },
})
</script>

<docs lang="mdx">
## Events

A list of events that the component will emit:

- [`UserClickedClearAllFilters`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts):
  the event is emitted after the user clicks the button to clear a certain facets filter. The event
  payload is the id of the facets that are going to be cleared.
- [`UserClickedClearAllFilters`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts):
  the event is emitted after the user clicks the button. The event payload is undefined.

## Examples

This component renders a button, which on clicked emits the `UserClickedClearAllFilters` or
`UserClickedClearAllFilters` event.

### Basic usage

```vue
<ClearFilters />
```

### Customizing its contents

In this example, show the custom message in button.

```vue
<ClearFilters v-slot="{ selectedFilters }">
  Delete {{ selectedFilters.length }} selected
</ClearFilters>
```

In this example, show the custom message in button with always visible a true and list of facets
ids.

```vue
<ClearFilters v-slot="{ selectedFilters }" :alwaysVisible="true" :facetsIds="facetsIds">
  Delete {{ selectedFilters.length }} selected
</ClearFilters>
```
</docs>
