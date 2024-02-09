<script lang="ts">
  import { Component, Inject, Prop, Watch } from 'vue-property-decorator';
  import Vue from 'vue';
  import { createRawFilters } from '../../../utils/filters';
  import { isArrayEmpty } from '../../../utils/array';
  import { SnippetConfig } from '../../../x-installer/api/api.types';

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
    @Inject('snippetConfig')
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
     * Gets the provided preselected filters prioritizing the {@link SnippetConfig} over the
     * filters prop.
     *
     * @returns An array of filter's ids.
     */
    protected get preselectedFilters(): string[] {
      return this.snippetConfig?.filters ?? this.filters;
    }

    /**
     * Emits the {@link FacetsXEvents.PreselectedFiltersProvided} to save
     * the provided filters in the state.
     */
    protected emitPreselectedFilters(): void {
      if (!isArrayEmpty(this.preselectedFilters)) {
        this.$x.emit('PreselectedFiltersProvided', createRawFilters(this.preselectedFilters));
      }
    }

    /**
     * Emits the {@link FacetsXEvents.PreselectedFiltersProvided} when the
     * component is created.
     */
    created(): void {
      this.emitPreselectedFilters();
    }

    /**
     * Emits the {@link FacetsXEvents.PreselectedFiltersProvided} when the
     * preselectedFilters computed property changes.
     */
    @Watch('preselectedFilters')
    syncPreselectedFilters(): void {
      this.emitPreselectedFilters();
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    render(): void {}
  }
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
