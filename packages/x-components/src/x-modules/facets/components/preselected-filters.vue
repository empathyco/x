<script lang="ts">
  import { defineComponent, inject, PropType, onMounted, watch, computed, ComputedRef } from 'vue';
  import { createRawFilters } from '../../../utils/filters';
  import { isArrayEmpty } from '../../../utils/array';
  import { SnippetConfig } from '../../../x-installer/api/api.types';
  import { use$x, useNoElementRender } from '../../../composables/index';

  /**
   * This component emits {@link FacetsXEvents.PreselectedFiltersProvided} when a preselected filter
   * is set in the snippet config or by using the prop of the component.
   *
   * @public
   */
  export default defineComponent({
    name: 'PreselectedFilters',
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
        default: () => []
      }
    },
    setup(props, { slots }) {
      const $x = use$x();

      /**
       * Injects {@link SnippetConfig} provided by an ancestor as snippetConfig.
       *
       * @internal
       */
      const snippetConfig = inject<SnippetConfig | undefined>('snippetConfig');

      /**
       * Gets the provided preselected filters prioritizing the {@link SnippetConfig} over the
       * filters prop.
       *
       * @returns An array of filter's ids.
       */
      const preselectedFilters: ComputedRef<string[]> = computed(() => {
        return snippetConfig?.value?.filters ?? props.filters;
      });

      /**
       * Emits the {@link FacetsXEvents.PreselectedFiltersProvided} to save
       * the provided filters in the state.
       */
      const emitPreselectedFilters = (): void => {
        if (!isArrayEmpty(preselectedFilters.value)) {
          $x.emit('PreselectedFiltersProvided', createRawFilters(preselectedFilters.value));
        }
      };

      /**
       * Emits the {@link FacetsXEvents.PreselectedFiltersProvided} when the
       * computed prop changes.
       */
      watch(preselectedFilters, emitPreselectedFilters);

      /**
       * Emits the {@link FacetsXEvents.PreselectedFiltersProvided} when the
       * component is mounted.
       */
      onMounted(() => {
        emitPreselectedFilters();
      });

      return () => useNoElementRender(slots);
    }
  });
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

<script>
  import { PreselectedFilters } from '@empathyco/x-components';
  export default {
    name: 'PreselectedFiltersDemo',
    components: {
      PreselectedFilters
    },
    provide: {
      snippetConfig: {
        filters: ['{!tag=brand_facet}brand_facet:"Lego"', '{!tag=age_facet}age_facet:"toddler"']
      }
    }
  };
</script>
```

### Play with props

In this example, the preselected filters have been configured to use a list of configured filters by
prop:

```vue
<template>
  <PreselectedFilters :filters="filters" />
</template>

<script>
  import { PreselectedFilters } from '@empathyco/x-components';
  export default {
    name: 'PreselectedFiltersDemo',
    components: {
      PreselectedFilters
    },
    computed: {
      filters() {
        return ['{!tag=brand_facet}brand_facet:"Lego"', '{!tag=age_facet}age_facet:"toddler"'];
      }
    }
  };
</script>
```
</docs>
