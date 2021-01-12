<template>
  <BaseFilters
    v-slot="{ filter }"
    :filters="filters"
    :animation="animation"
    class="x-multi-select-filters"
  >
    <!--
        @slot (Required) The filter component to be rendered.
        @binding {Filter} filter - The filter data.
     -->
    <slot :filter="filter" />
  </BaseFilters>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { Filter } from '@empathy/search-types';
  import { State } from '../../../components/decorators/store.decorators';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { facetsXModule } from '../x-module';
  import BaseFilters from '../../../components/filters/lists/base-filters.vue';
  import { FacetsConfig } from '../config.types';

  /**
   * The component renders a list of filters, exposing a default slot to set how the filter should
   * be rendered. This component will change the facet configuration of the rendered filters to
   * allow multi selection. If you just need to render a list of filters that don't support
   * multi-selection, or are from a different facet, use the {@link BaseFilters} component.
   *
   * @public
   */
  @Component({
    components: {
      BaseFilters
    },
    mixins: [xComponentMixin(facetsXModule)]
  })
  export default class MultiSelectFilters extends Vue {
    /**
     * The list of filters to be rendered. This ones should be filters
     * from the same facet.
     *
     * @public
     */
    @Prop({ required: true })
    public filters!: Filter[];

    /**
     * Animation component that will be used to animate the filters.
     *
     * @public
     */
    @Prop()
    public animation!: Vue | string;

    /**
     * The facets module configuration.
     *
     * @internal
     */
    @State('facets', 'config')
    public facetsConfig!: FacetsConfig;

    /**
     * Retrieves the facet id property. In the case the filters list is empty, it returns
     * `null`.
     *
     * @returns The facet id for the filters list, or `null` if the list is empty.
     * @internal
     */
    protected get facetId(): null | string {
      const facetId = this.filters[0]?.facetId;
      return facetId ?? null;
    }

    protected created(): void {
      /* eslint-disable @typescript-eslint/unbound-method */
      /* Watcher added here because when used with immediate the $x object isn't available */
      this.$watch('facetId', this.emitMultiSelectChanged, { immediate: true });
      /* eslint-enable @typescript-eslint/unbound-method */
    }

    /**
     * Emits the {@link FacetsXEvents.FacetMultiSelectChanged} event.
     * If the `multiSelect` prop has the same value than in the store, or the facet id is not
     * available, it won't emit the event.
     *
     * @internal
     */
    protected emitMultiSelectChanged(): void {
      /*
       If the facetId is not null, and the multiSelect configuration is different than the one
       in the store for the facet, we emit the event.
       This prevents the `FacetMultiSelectChanged` from being emitted in 2 use cases:
       - The filters array is empty.
       - The component has been destroyed, and then mounted again. For example if it is inside
       any kind of panel or modal.
       */
      if (this.facetId !== null && !this.facetsConfig.multiSelect[this.facetId]) {
        this.$x.emit('FacetMultiSelectChanged', {
          facetId: this.facetId,
          multiSelect: true
        });
      }
    }
  }
</script>

<docs>
# Examples

The component renders a list of filters, exposing a default slot to set how the filter should
be rendered. This component will change the facet configuration of the rendered filters to allow
multi selection. If you just need to render a list of filters that don't support multi-selection,
or are from a different facet, use the `BaseFilters` component instead.

## Basic usage

Just provide the `filters` prop and the component that they should render. These filters *must* all
be from the same facet.

```vue
<MultiSelectFilters :filters="multi" v-slot="{ filter }">
  <button @click="doThings">{{ filter.label }}</button>
</MultiSelectFilters>
```

## Full example

The `MultiSelectFilters` component is prepared to be used with the `Facets` one and with the base
filter components (like the `BaseSimpleFilter`). Apart from the filters array that is the only
mandatory prop, it allows you to configure the transitions (using the `animation` prop).

```vue
<template>
  <Facets v-slot="{ facet }">
    <MultiSelectFilters
      :animation="animation"
      :filters="facet.filters"
      v-slot="{ filter }">
      <BaseSimpleFilter :filter="filter"/>
    </MultiSelectFilters>
  </Facets>
</template>

<script>
  import { BaseSimpleFilter, StaggeredFadeAndSlide } from '@empathy/x-components';
  import { Facets, MultiSelectFilters } from '@empathy/x-components/facets';

  export default {
    components: {
      Facets,
      MultiSelectFilters,
      BaseSimpleFilter
    },
    data() {
      return {
        animation: StaggeredFadeAndSlide
      };
    }
  }
</script>
```
</docs>
