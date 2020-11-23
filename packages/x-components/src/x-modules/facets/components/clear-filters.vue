<template>
  <BaseEventButton
    v-if="show"
    class="x-clear-filters"
    data-test="clear-filters"
    :disabled="!areThereSelectedFilters"
    :events="events"
    :class="cssClasses"
  >
    <slot :selectedFilters="facetsSelectedFilters" />
  </BaseEventButton>
</template>

<script lang="ts">
  import { Facet, Filter } from '@empathy/search-types';
  import { Component, Prop } from 'vue-property-decorator';
  import Vue from 'vue';
  import { Getter, xComponentMixin } from '../../../components';
  import { XEventsTypes } from 'src/wiring';
  import BaseEventButton from '../../../components/base-event-button.vue';
  import { VueCSSClasses } from 'src/utils';
  import { facetsXModule } from '../x-module';

  /**
   * Renders a simple button, emitting the needed events when clicked.
   *
   * @public
   */
  @Component({
    components: { BaseEventButton },
    mixins: [xComponentMixin(facetsXModule)]
  })
  export default class ClearFilters extends Vue {
    /**
     * It handles if the ClearFilters button is always visible no matter if there are not
     * filters selected. If false, the ClearFilters button is not visible whether
     * there are no filters selected.
     *
     * @public
     */
    @Prop({ default: false })
    public alwaysVisible!: boolean;

    /**
     * Array of facets ids that will be passed to event like payload.
     *
     * @public
     */
    @Prop()
    public facetsIds?: Array<Facet['id']>

    /**
     * Get the selected filters from store.
     *
     * @internal
     */
    @Getter('facets', 'selectedFilters')
    public allSelectedFilters!: Filter[];

    /**
     * If alwaysVisible prop is true, ClearAllFilters button is always shown, but disabled
     * if there are no filters selected.
     * If alwaysVisible prop is false, ClearAllFilters button is shown whether there
     * are some filter selected.
     *
     * @returns True if alwaysVisible is true or in the opposite case true or false depends
     * on if there are selected filters or not.
     *
     * @internal
     */
    protected get show(): boolean {
      return this.alwaysVisible || this.areThereSelectedFilters;
    }

    /**
     * Get selected filters.
     * If there are facets ids, get selected filters whose facet id match with some of facets ids.
     * If there aren't facets ids, get selected filters.
     *
     * @returns Array of selected filters depends on there are facets ids or not.
     * @internal
     */
    protected get facetsSelectedFilters(): Filter[] {
      if(this.facetsIds) {
        return this.allSelectedFilters.filter(filter => this.facetsIds!.includes(filter.facetId))
      } else {
        return this.allSelectedFilters;
      }
    }

    /**
     * Check if there are selected filters.
     *
     * @returns True or false depends on if there are facets ids and if there are selected filters.
     * @internal
     */
    protected get areThereSelectedFilters(): boolean {
      return !!this.facetsSelectedFilters.length;
    }

    /**
     * The events that will be emitted when the button clear filters is clicked.
     *
     * @returns The events to be emitted when the button clear filters is clicked.
     * @internal
     */
    protected get events(): Partial<XEventsTypes> {
      return this.facetsIds ? {
          UserClickedClearFiltersFacetsButton: this.facetsIds
      } : {
        UserClickedClearFiltersButton: undefined
      };
    }

    /**
     * Dynamic CSS classes to apply to the component.
     *
     * @returns The dynamic CSS classes to apply to the component.
     * @internal
     */
    protected get cssClasses(): VueCSSClasses {
      return {
        'x-clear-filters--has-not-selected-filters': !this.areThereSelectedFilters,
        'x-clear-filters--has-selected-filters': this.areThereSelectedFilters
      };
    }
  }
</script>

<docs>
#Example

This component renders a button, which on clicked emits the `UserClickedClearFiltersButton`
event.

## Basic usage

```vue
<ClearFilters />
```

## Customizing its contents

In this example, show the custom message in button.

```vue
<ClearFilters v-slot="{ selectedFilters }" >
  Delete {{ selectedFilters.length }} selected
</ClearFilters>
```

In this example, show the custom message in button with always visible a true and
list of facets ids.

```vue
<ClearFilters v-slot="{ selectedFilters }" :alwaysVisible="true" :facetsIds="facetsIds">
  Delete {{ selectedFilters.length }} selected
</ClearFilters>
```
</docs>
