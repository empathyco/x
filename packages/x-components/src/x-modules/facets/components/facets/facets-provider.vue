<script lang="ts">
  import { Facet, Filter, isHierarchicalFacet } from '@empathyco/x-types';
  import Vue from 'vue';
  import { Component, Prop, Watch } from 'vue-property-decorator';
  import { XOn } from '../../../../components';
  import { xComponentMixin } from '../../../../components/x-component.mixin';
  import { clone } from '../../../../utils';
  import { areFiltersDifferent } from '../../../../utils/filters';
  import { FacetsGroup } from '../../service/types';
  import { GroupId } from '../../store/types';
  import { flatHierarchicalFilters } from '../../utils';
  import { facetsXModule } from '../../x-module';

  /**
   * This component allows to provide facets by prop, to add them to the state of the
   * `Facets X-Module`. These facets will be added to the `Facets X-Module` state together with
   * the facets emitted by the `Search X-Module` through the {@link SearchXEvents.FacetsChanged}
   * event.
   *
   * @public
   */
  @Component({
    mixins: [xComponentMixin(facetsXModule)]
  })
  export default class FacetsProvider extends Vue {
    /**
     * An facet group identifier to distinguish the provided facets from other facets like the
     * `Search X-Module` facets.
     *
     * @public
     */
    @Prop({ default: 'provided-facets' })
    public groupId!: GroupId;

    /**
     * The facets to provide to the `Facets X-Module` state. They have to include the
     * {@link @empathyco/x-types#Filter | filters}.
     *
     * @internal
     */
    @Prop({ required: true })
    public facets!: Facet[];

    /**
     * Temporarily stores the selected filters from the {@link FacetsProvider.facets} prop.
     * This is necessary to handle the {@link FacetsXEvents.UserChangedSelectedFilters} event.
     *
     * @internal
     */
    protected selectedFilters: Filter[] | null = null;

    /**
     * A computed property to group the facets and the groupId. This is used by the watcher.
     *
     * @returns The FacetGroup with the facets and the group id.
     *
     * @internal
     */
    protected get facetsGroup(): FacetsGroup {
      return { id: this.groupId, facets: this.facets };
    }

    /**
     * Emits the {@link FacetsXEvents.UserChangedSelectedFilters} event when the user changes
     * the selected filters.
     *
     * @param selectedFilters - The new list of selected filters.
     * @internal
     */
    @XOn('SelectedFiltersChanged')
    emitSelectedFiltersChanged(selectedFilters: Filter[]): void {
      if (
        this.selectedFilters === null ||
        areFiltersDifferent(this.selectedFilters, selectedFilters)
      ) {
        this.$x.emit('UserChangedSelectedFilters', selectedFilters);
      }
      this.selectedFilters = null;
    }

    /**
     * Emits the {@link FacetsXEvents.FacetsGroupProvided} event with the
     * {@link FacetsProvider.facetsGroup} as payload. It also extracts and saves the selected
     * filters.
     */
    @Watch('facetsGroup', { immediate: true })
    provideFacets(): void {
      if (this.facetsGroup.facets) {
        const facetsGroupClone = clone(this.facetsGroup);
        this.$x.emit('FacetsGroupProvided', facetsGroupClone);
        this.extractSelectedFilters(this.facets);
      }
    }

    /**
     * Extracts the selected filters from the facets and stores them in the
     * {@link FacetsProvider.selectedFilters} property.
     *
     * @param facets - The facets from whom extract the selected filters.
     * @internal
     */
    protected extractSelectedFilters(facets: Facet[]): void {
      this.selectedFilters = facets
        .flatMap(facet =>
          isHierarchicalFacet(facet) ? flatHierarchicalFilters(facet.filters) : facet.filters
        )
        .filter(filter => filter.selected);
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    render(): void {}
  }
</script>

<style lang="scss" scoped>
  .x-facets-list {
    list-style-type: none;
  }
</style>

<docs lang="mdx">
## Example

This component allows to provide facets by prop, to add them to the state of the `Facets X-Module`.
These facets will be added to the `Facets X-Module` state together with the facets emitted by the
`Search X-Module` through the {@link SearchXEvents.FacetsChanged} event.

```vue
<template>
  <FacetsProvider :facets="myFacets" />
</template>

<script>
  import { FacetsProvider } from '@empathyco/x-components/facets';

  export default {
    components: {
      FacetsProvider
    },
    data() {
      return {
        myFacets: [
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
                totalResults: 10
              },
              {
                modelName: 'SimpleFilter',
                id: 'color:blue',
                facetId: 'color-facet',
                label: 'Blue',
                selected: false,
                value: 'color:blue',
                totalResults: 10
              }
            ]
          }
        ]
      };
    }
  };
</script>
```

## Events

A list of events that the component will emit:

- `UserChangedSelectedFilters`: the event is emitted after the user performed an action that changed
  the selected filters. The payload is the new list of selected filters.
- `FacetsGroupProvided`: the event is emitted after updating the facets prop with a new list of
  facets. The payload contains a Facets Group with the facets and the group id.
</docs>
