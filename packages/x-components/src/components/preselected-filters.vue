<script lang="ts">
  import { Component, Inject, Prop } from 'vue-property-decorator';
  import Vue from 'vue';
  import { createRawFilters } from '../utils/filters';
  import { isArrayEmpty } from '../utils/array';
  import { SnippetConfig } from '../x-installer/api/api.types';

  /**
   * This component emits {@link FacetsXEvents.PreselectedFiltersProvided} when a preselected filter
   * is set in the snippet config or by using the prop of the component.
   *
   * @public
   */
  @Component
  export default class PreselectedFilters extends Vue {
    /**
     * Injects {@link SnippetConfig} provided by an ancestor as snippetConfig.
     *
     * @internal
     */
    @Inject()
    public snippetConfig?: SnippetConfig;

    /**
     * A list of filters to preselect.
     *
     * @remarks Emits the {@link FacetsXEvents.PreselectedFiltersProvided} when the
     * component is created.
     *
     * @public
     */
    @Prop({ default: () => [] })
    public filters!: string[];

    /**
     * Emits the provided preselected filters prioritizing the {@link SnippetConfig} over the
     * filters prop.
     */
    created(): void {
      const preselectedFilters = this.snippetConfig?.filters ?? this.filters;
      if (!isArrayEmpty(preselectedFilters)) {
        this.$x.emit('PreselectedFiltersProvided', createRawFilters(preselectedFilters));
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    render(): void {}
  }
</script>

<docs lang="mdx">
## Events

A list of events that the component will emit:

[`PreselectedFiltersProvided`](./../../api/x-components.preselectedfiltersprovided.md).

## See it in action

_See how the event is triggered when the component is rendered._

```vue
<template>
  <PreselectedFilters />
</template>

<script>
  import { PreselectedFilters, baseSnippetConfig } from '@empathyco/x-components';
  export default {
    name: 'PreselectedFiltersDemo',
    components: {
      PreselectedFilters
    },
    provide: {
      ...baseSnippetConfig,
      filters: ['{!tag=brand_facet}brand_facet:"Lego"', '{!tag=age_facet}age_facet:"toddler"']
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
