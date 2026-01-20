<script lang="ts">
import type { PropType } from 'vue'
import type { SnippetConfig } from '../../../x-installer/api/api.types'
import { computed, defineComponent, inject, watch } from 'vue'
import { useXBus } from '../../../composables/use-x-bus'
import { isArrayEmpty } from '../../../utils/array'
import { createRawFilters } from '../../../utils/filters'
import { facetsXModule } from '../x-module'

/**
 * This component emits {@link FacetsXEvents.PreselectedFiltersProvided} when a preselected filter
 * is set in the snippet config or by using the prop of the component.
 *
 * @public
 */
export default defineComponent({
  name: 'PreselectedFilters',
  xModule: facetsXModule.name,
  props: {
    /**
     * A list of filters to preselect.
     *
     * @remarks Emits the {@link FacetsXEvents.PreselectedFiltersProvided} when the
     * component is created.
     *
     * @public
     */
    filters: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
  },
  setup(props, { slots }) {
    const xBus = useXBus()

    /**
     * Injects {@link SnippetConfig} provided by an ancestor as snippetConfig
     * and sets is as a ref to get synced when it changes.
     *
     * @internal
     */
    const snippetConfig = inject<SnippetConfig>('snippetConfig')

    /**
     * Gets the provided preselected filters prioritizing the {@link SnippetConfig} over the
     * filters prop.
     *
     * @returns An array of filter's ids.
     * @internal
     */
    const preselectedFilters = computed<string[]>(() => {
      return snippetConfig?.filters ?? props.filters
    })

    /**
     * Emits the {@link FacetsXEvents.PreselectedFiltersProvided} to save
     * the provided filters in the state.
     *
     * @internal
     */
    const emitPreselectedFilters = (): void => {
      if (!isArrayEmpty(preselectedFilters.value)) {
        xBus.emit('PreselectedFiltersProvided', createRawFilters(preselectedFilters.value))
      }
    }

    /**
     * Emits the {@link FacetsXEvents.PreselectedFiltersProvided} when the
     * computed prop changes.
     */
    watch(preselectedFilters, emitPreselectedFilters, { immediate: true })

    return () => slots.default?.()[0] ?? ''
  },
})
</script>

<docs lang="mdx">
## Events

A list of events that the component will emit:

[`PreselectedFiltersProvided`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts).

## See it in action

_See how the event is triggered when the component is rendered._

```vue
<template>
  <PreselectedFilters />
</template>

<script setup>
import { PreselectedFilters } from '@empathyco/x-components'
import { provide } from 'vue'

provide('snippetConfig', {
  filters: ['{!tag=brand_facet}brand_facet:"Lego"', '{!tag=age_facet}age_facet:"toddler"'],
})
</script>
```

### Play with props

In this example, the preselected filters have been configured to use a list of configured filters by
prop:

```vue
<template>
  <PreselectedFilters :filters="filters" />
</template>

<script setup>
import { PreselectedFilters } from '@empathyco/x-components'
import { ref } from 'vue'

const filters = ref(['{!tag=brand_facet}brand_facet:"Lego"', '{!tag=age_facet}age_facet:"toddler"'])
</script>
```
</docs>
