<template>
  <BaseEventButton
    class="x-all-filter"
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
    <slot :facet="facet">≡ {{ facet.label }}</slot>
  </BaseEventButton>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { Facet } from '@empathy/search-types';
  import BaseEventButton from '../base-event-button.vue';
  import { VueCSSClasses } from '../../utils/types';
  import { XEventsTypes } from '../../wiring/events.types';

  /**
   * This component receives a required `facet` as prop and renders a button, which on clicked emits
   * the {@link FacetsXEvents.UserClickedFacetAllFilter} event. By default the rendered button
   * displays a message with the facet label but this content is customizable through the default
   * slot.
   *
   * @public
   */
  @Component({
    components: { BaseEventButton }
  })
  export default class BaseAllFilter extends Vue {
    /** The facet data. */
    @Prop({ required: true })
    public facet!: Facet;

    /**
     * The event that will be emitted when the all filter button is clicked.
     *
     * @internal
     */
    protected clickEvent: Partial<XEventsTypes> = {
      UserClickedFacetAllFilter: this.facet.id
    };

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
        'x-all-filter--selected': !this.facet.filters.some(filter => filter.selected)
      };
    }
  }
</script>

<docs>
#Example

This component receives a required `facet` as prop and renders a button, which on clicked emits the
UserClickedFacetAllFilter event. By default the rendered button displays a message with the facet
label but this content is customizable through the default slot.

## Basic usage

```vue
<BaseAllFilter :facet="facet" />
```

## Customizing its content

```vue
<BaseAllFilter v-slot="{ facet }" :facet="facet">
  Select all {{ facet.label }}
</BaseAllFilter>
```

## Basic example within facets

```vue
<Facets>
  <template #default="{ facet }">
    <BaseAllFilter :facet="facet" />
    <BaseFilters v-slot="{ filter }" :filters="facet.filters">
      <BaseSimpleFilter :filter="filter" />
    </BaseFilters>
  </template>
</Facets>
```

## Custom example within facets

```vue
<Facets>
  <template #default="{ facet }">
    <BaseAllFilter v-slot="{ facet }" :facet="facet">
      Select all {{ facet.label }}
    </BaseAllFilter>
    <BaseFilters v-slot="{ filter }" :filters="facet.filters">
      <BaseSimpleFilter :filter="filter" />
    </BaseFilters>
  </template>
</Facets>
```

</docs>
