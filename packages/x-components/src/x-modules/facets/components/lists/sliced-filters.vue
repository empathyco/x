<template>
  <div class="x-sliced-filters" :class="cssClasses" data-test="filters-show-more">
    <!--
      @slot (Required) Sliced filters content.
        @binding {Filter[]} slicedFilters - Sliced filters..
    -->
    <slot :sliced-filters="slicedFilters" />
    <template v-if="showButton">
      <button
        v-if="showMoreFilters"
        class="x-facet-filter x-sliced-filters__button x-sliced-filters__button--show-more"
        :class="buttonClass"
        data-test="sliced-filters-show-more-button"
        @click="toggleShowMoreFilters"
      >
        <!--
          @slot Button show more filters.
            @binding {number} difference - The difference between the filters and max to show.
        -->
        <slot name="show-more" :difference="difference">
          Show
          <span data-test="show-more-amount">{{ difference }}</span>
          more filters
        </slot>
      </button>
      <button
        v-else
        class="x-facet-filter x-sliced-filters__button x-sliced-filters__button--show-less"
        :class="buttonClass"
        data-test="sliced-filters-show-less-button"
        @click="toggleShowMoreFilters"
      >
        <!--
          @slot Button show less filters.
            @binding {number} difference - The difference between the filters and max to show.
        -->
        <slot name="show-less" :difference="difference">
          Show
          <span data-test="show-less-amount">{{ difference }}</span>
          less filters
        </slot>
      </button>
    </template>
  </div>
</template>

<script lang="ts">
import type { Filter } from '@empathyco/x-types'
import type { PropType } from 'vue'
import type { VueCSSClasses } from '../../../../utils'
import { computed, defineComponent, provide, ref } from 'vue'
import { useFiltersInjection } from '../../composables/use-filters-injection'
import { facetsXModule } from '../../x-module'

/**
 * Component that slices a list of filters and returns them using the default scoped slot,
 * allowing the user to show the full list of them or slicing them again using the
 * show more/less buttons.
 *
 * @public
 */
export default defineComponent({
  name: 'SlicedFilters',
  xModule: facetsXModule.name,
  props: {
    /**
     * The list of filters to be rendered as slots.
     *
     * @public
     */
    filters: Array as PropType<Filter[]>,
    /**
     * This prop is used in the `HierarchicalFilter` component and only in that case. It is necessary
     * to make the `renderedFilters` to return only the filters of each level of the hierarchy.
     */
    parentId: {
      type: String as PropType<Filter['id']>,
      required: false,
    },
    /** The maximum number of filters to show. */
    max: {
      type: Number,
      required: true,
    },
    buttonClass: String,
  },
  emits: ['click:show-less', 'click:show-more'],
  setup(props, { emit }) {
    /** For showing the remaining filters. */
    const showMoreFilters = ref(true)

    const renderedFilters = useFiltersInjection(props)

    /**
     * Show the buttons template when length filters is greater than property max.
     *
     * @returns Boolean if length filters is greater than property max.
     * @internal
     */
    const showButton = computed(() => renderedFilters.value.length > props.max)

    /**
     * Sliced the array of filters depends on click button show more.
     *
     * @returns Array of sliced filters or all filters.
     * @internal
     */
    const slicedFilters = computed((): Filter[] => {
      return showMoreFilters.value
        ? renderedFilters.value.slice(0, props.max)
        : renderedFilters.value
    })
    provide('filters', slicedFilters)

    /**
     * The difference between length filters and max to show.
     *
     * @returns Number of remaining filters to show.
     * @internal
     */
    const difference = computed(() => renderedFilters.value.length - props.max)

    /**
     * Show or hide the remaining filters. It also emits a Vue event based on the clicked button.
     *
     * @param event - The click event.
     *
     * @internal
     */
    const toggleShowMoreFilters = (event: MouseEvent): void => {
      showMoreFilters.value = !showMoreFilters.value
      emit(showMoreFilters.value ? 'click:show-less' : 'click:show-more', event)
    }

    /**
     * Adds the dynamic css classes to the component.
     *
     * @returns The classes to be added to the component.
     * @internal
     */
    const cssClasses = computed((): VueCSSClasses => {
      return {
        'x-sliced-filters--is-sliced': showButton.value,
      }
    })

    return {
      cssClasses,
      toggleShowMoreFilters,
      showButton,
      difference,
      slicedFilters,
      showMoreFilters,
    }
  },
})
</script>

<docs lang="mdx">
## Example

The sliced filters component, takes a list of filters, and the maximum number of filters to render
as prop. Then, it slices the list of filters using the `max` prop, and returns this new filters list
using the default scoped slot.

The user can click the show more button if he wants to see the full list of filters, or the show
less button when he wants to reset the filters. This buttons text or icons can be configured via
slot too. They receive a `difference` prop which can be useful for writing friendlier messages.

This component is usually integrated with the `Facets` and `Filters` component. It is useful when
there are lots of available filters for a single facet, helping to improve the app performance, as
less nodes are rendered.

### Important

The component has two ways of receive the filters list, it can be injected by another component or
be send it as a prop. If the component doesnt have a parent component that receive and exposed a
filters list to their children, it is mandatory to send it as prop.

### Basic usage

```vue
<template>
  <Facets v-slot="{ facet }">
    <SlicedFilters :filters="facet.filters" :max="4">
      <template #default="{ slicedFilters }">
        <Filters :items="slicedFilters" v-slot="{ filter }">
          <SimpleFilter :filter="filter" />
        </Filters>
      </template>
      <template #show-more="{ difference }">
        Show
        <span data-test="show-more-amount">{{ difference }}</span>
        more filters
      </template>
      <template #show-less="{ difference }">
        Show
        <span data-test="show-less-amount">{{ difference }}</span>
        less filters
      </template>
    </SlicedFilters>
  </Facets>
</template>

<script setup>
import { Facets, SlicedFilters, Filters, SimpleFilter } from '@empathyco/x-components'
</script>
```

> **Using injection**: It can receive the filters list by injection. It only works if it has a
> parent component that receives and exposes the filters list. Using the injection, It is not
> necessary to send the prop to the child components, it has to be send it in the parent component ,
> the rest of components will inject this list.

```vue
<template>
  <Facets v-slot="{ facet }">
    <SlicedFilters :filters="facet.filters" :max="4">
      <Filters v-slot="{ filter }">
        <SimpleFilter :filter="filter" />
      </Filters>
      <template #show-more="{ difference }">Show {{ difference }} more filters</template>
      <template #show-less="{ difference }">Show {{ difference }} less filters</template>
    </SlicedFilters>
  </Facets>
</template>

<script setup>
import { Facets, SlicedFilters, Filters, SimpleFilter } from '@empathyco/x-components'
</script>
```

### Customizing the items with classes

The `buttonClass` prop can be used to add classes to the show more/less buttons.

```vue
<template>
  <Facets v-slot="{ facet }">
    <SlicedFilters :filters="facet.filters" :max="4" buttonClass="x-facet-filter-lg">
      <Filters v-slot="{ filter }">
        <SimpleFilter :filter="filter" />
      </Filters>
      <template #show-more="{ difference }">Show {{ difference }} more filters</template>
      <template #show-less="{ difference }">Show {{ difference }} less filters</template>
    </SlicedFilters>
  </Facets>
</template>

<script setup>
import { Facets, SlicedFilters, Filters, SimpleFilter } from '@empathyco/x-components'
</script>
```
</docs>
