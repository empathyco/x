<script lang="ts">
import type { BooleanFilter } from '@empathyco/x-types'
import type { Dictionary } from '@empathyco/x-utils'
import type { PropType } from 'vue'
import type { XEvent, XEventsTypes } from '../../../../wiring/events.types'
import { computed, defineComponent } from 'vue'
import { useXBus } from '../../../../composables/use-x-bus'
import { facetsXModule } from '../../x-module'

/**
 * Renders default slot content. It binds to the default slot a
 * {@link @empathyco/x-types#BooleanFilter}, the {@link XEvent}
 * that will be emitted when clicking the content, the CSS classes and if the content should be
 * deactivated.
 *
 * @remarks The default slot expects a root element, if it receives a list of elements, it will
 * render the first element.
 *
 * @public
 */
export default defineComponent({
  name: 'RenderlessFilter',
  xModule: facetsXModule.name,
  inheritAttrs: false,
  props: {
    /** The filter data to render. */
    filter: {
      type: Object as PropType<BooleanFilter>,
      required: true,
    },
    /** Additional events with its payload to emit when the filter is clicked. */
    clickEvents: Object as PropType<Partial<XEventsTypes>>,
    /** Inheritance CSS classes. */
    cssClasses: {
      type: Array as PropType<(string | Dictionary<boolean>)[]>,
      default: () => [],
    },
  },
  setup(props, { slots }) {
    const xBus = useXBus()

    /** Returns `true` when the filter should be disabled. */
    const isDisabled = computed(() => props.filter.totalResults === 0)

    /** CSS classes to apply to the element. */
    const innerCssClasses = computed(() => [
      'x-facet-filter',
      { 'x-selected': props.filter.selected },
      ...props.cssClasses,
    ])

    /** The events that will be emitted when the filter is clicked. */
    const innerClickEvents = computed(() => ({
      UserClickedAFilter: props.filter,
      ...props.clickEvents,
    }))

    /** Emit filter click events to the bus. */
    function emitClickEvents() {
      Object.entries(innerClickEvents.value).forEach(([event, payload]) => {
        xBus.emit(event as XEvent, payload)
      })
    }

    return () =>
      slots.default?.({
        filter: props.filter,
        clickFilter: emitClickEvents,
        cssClasses: innerCssClasses.value,
        isDisabled: isDisabled.value,
      }) ?? ''
  },
})
</script>

<docs lang="mdx">
## Examples

Renders default slot content. It binds to the default slot a filter, the events that will be emitted
when clicking the content, the CSS classes and if the content should be deactivated.

### Basic usage

```vue
<template>
  <RenderlessFilter :filter="filter" />
</template>

<script setup>
import { RenderlessFilter } from '@empathyco/x-components/facets'
import { ref } from 'vue'

const filter = ref({
  id: 'color:red',
  modelName: 'SimpleFilter',
  label: 'Red',
  facetId: 'color',
  selected: false,
  totalResults: 10,
})
</script>
```

### Customizing its contents and adding new events

```vue
<template>
  <RenderlessFilter
    :filter="filter"
    :clickEvents="clickEvents"
    v-slot="{ filter, clickFilter, cssClasses, isDisabled }"
  >
    <button @click="clickFilter" :class="cssClasses" :disabled="isDisabled">
      {{ filter.label }}
    </button>
  </RenderlessFilter>
</template>

<script setup>
import { RenderlessFilter } from '@empathyco/x-components/facets'
import { ref, computed } from 'vue'

const filter = ref({
  id: 'color:red',
  modelName: 'SimpleFilter',
  label: 'Red',
  facetId: 'color',
  selected: false,
  totalResults: 10,
})
const clickEvents = computed(() => ({ UserClickedAHierarchicalFilter: filter.value }))
</script>
```
</docs>
