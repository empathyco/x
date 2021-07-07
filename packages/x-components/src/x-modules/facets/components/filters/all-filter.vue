<template>
  <BaseEventButton
    class="x-filter x-all-filter"
    data-test="all-filter"
    role="checkbox"
    :aria-checked="facet.label.toString()"
    :events="clickEvent"
    :class="cssClasses"
  >
    <!--
        @slot The content to render inside the button
            @binding {Facet} Facet - The facet data
      -->
    <slot :facet="facet" :isSelected="isSelected">all</slot>
  </BaseEventButton>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { Facet } from '@empathyco/x-types';
  import { Getter, xComponentMixin } from '../../../../components';
  import BaseEventButton from '../../../../components/base-event-button.vue';
  import { isArrayEmpty } from '../../../../utils/array';
  import { VueCSSClasses } from '../../../../utils/types';
  import { XEventsTypes } from '../../../../wiring/events.types';
  import { FiltersByFacet } from '../../store/types';
  import { facetsXModule } from '../../x-module';

  /**
   * This component receives a required `facet` with
   * {@link @empathyco/x-types#BooleanFilter | BooleanFilter} as prop and renders a button, which
   * on clicked emits the {@link FacetsXEvents.UserClickedFacetAllFilter} event. By default
   * the rendered button displays a message with the facet label but this content is customizable
   * through the default slot.
   *
   * @public
   */
  @Component({
    components: { BaseEventButton },
    mixins: [xComponentMixin(facetsXModule)]
  })
  export default class AllFilter extends Vue {
    /** The facet data. */
    @Prop({ required: true })
    public facet!: Facet;

    /** The getter of the selectedFiltersByFacet. */
    @Getter('facets', 'selectedFiltersByFacet')
    public selectedFiltersByFacet!: FiltersByFacet;

    /**
     * The event that will be emitted when the all filter button is clicked.
     *
     * @internal
     */
    protected clickEvent: Partial<XEventsTypes> = {
      UserClickedFacetAllFilter: this.facet.id
    };

    /**
     * Computed to retrieve the selected state of this component.
     *
     * @returns True if is selected false otherwise.
     */
    protected get isSelected(): boolean {
      return isArrayEmpty(this.selectedFiltersByFacet?.[this.facet.id]);
    }

    /**
     * Dynamic CSS classes to apply to the component.
     *
     * @remarks This is only valid considering that in the case of HierarchicalFilters, ancestors
     * of nested selected filters are also selected.
     *
     * @returns The dynamic CSS classes to apply to the component.
     * @internal
     */
    protected get cssClasses(): VueCSSClasses {
      return {
        'x-filter--is-selected': this.isSelected,
        'x-all-filter--is-selected': this.isSelected
      };
    }
  }
</script>

<docs>
#Example

This component receives a required `facet` as prop and renders a button, which on clicked emits the
UserClickedFacetAllFilter event. By default the rendered button displays a message with the
facet label but this content is customizable through the default slot.

## Basic usage

```vue
<AllFilter :facet="facet" />
```

## Customizing its content

```vue
<AllFilter v-slot="{ facet }" :facet="facet">
  Select all {{ facet.label }}
</AllFilter>
```

## Basic example within facets

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

## Custom example within facets

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
## Events

A list of events that the component will emit:

- `UserClickedFacetAllFilter`: the event is emitted after the user clicks the button. The event
payload is the id of the facet that this `AllFilter` component corresponds to.
</docs>
