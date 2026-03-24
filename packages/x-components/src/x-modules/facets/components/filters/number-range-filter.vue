<template>
  <RenderlessFilter
    v-slot="{ filter: filterBinding, clickFilter, cssClasses: cssClassesBinding, isDisabled }"
    :css-classes="innerCssClasses"
    :click-events="innerClickEvents"
    :filter="filter"
  >
    <!--
      @slot The control element to render
      @binding {Filter} filter - The filter data
      @binding {() => void} clickFilter - Method that will invoke the needed actions after the user
      clicks the filter.
      @binding {Object} cssClasses - Object containing CSS classes to add to the button
      @binding {Boolean} isDisabled - True if the filter shouldn't be able to be selected by the
      user
    -->
    <slot
      v-bind="{
        filter: filterBinding,
        clickFilter,
        cssClasses: cssClassesBinding,
        isDisabled,
      }"
    >
      <button
        :aria-checked="filterBinding.selected.toString()"
        :class="cssClassesBinding"
        :disabled="isDisabled"
        data-test="filter"
        role="checkbox"
        v-bind="$attrs"
        @click="clickFilter"
      >
        <!--
          @slot The content to render inside the button
          @binding {Filter} filter - The filter data
        -->
        <slot :filter="filter" name="label">{{ filterBinding.label }}</slot>
      </button>
    </slot>
  </RenderlessFilter>
</template>

<script lang="ts">
import type { NumberRangeFilter as NumberRangeFilterModel } from '@empathyco/x-types'
import type { Dictionary } from '@empathyco/x-utils'
import type { PropType } from 'vue'
import type { XEventsTypes } from '../../../../wiring/events.types'
import { computed, defineComponent } from 'vue'
import { facetsXModule } from '../../x-module'
import RenderlessFilter from './renderless-filter.vue'

/**
 * Renders a number range filter, emitting the needed events when clicked.
 *
 * @public
 */
export default defineComponent({
  name: 'NumberRangeFilter',
  xModule: facetsXModule.name,
  components: { RenderlessFilter },
  inheritAttrs: false,
  props: {
    /** The filter data to render. */
    filter: {
      type: Object as PropType<NumberRangeFilterModel>,
      required: true,
    },
    /**
     * Additional events, with their payload, to emit when the filter is clicked.
     *
     * @public
     */
    clickEvents: Object as PropType<Partial<XEventsTypes>>,
    /** Inheritance CSS classes. */
    cssClasses: {
      type: Array as PropType<(string | Dictionary<boolean>)[]>,
      default: () => [],
    },
  },
  setup(props: any) {
    /**
     * The {@link XEventsTypes} to emit.
     *
     * @returns The events to emit when clicked.
     * @internal
     */
    const innerClickEvents = computed(() => ({
      UserClickedANumberRangeFilter: props.filter,
      ...props.clickEvents,
    }))

    /**
     * Dynamic CSS classes to apply to the component.
     *
     * @returns The dynamic CSS classes to apply to the component.
     * @internal
     */
    const innerCssClasses = computed(() => [
      'x-number-range-filter',
      { 'x-number-range-filter--is-selected': props.filter.selected },
      ...props.cssClasses,
    ])

    return {
      innerClickEvents,
      innerCssClasses,
    }
  },
})
</script>

<docs lang="mdx">
## Events

This component emits the following events:

- [`UserClickedAFilter`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts):
  the event is emitted after the user clicks the button, using the `filter` prop as its payload.
- [`UserClickedANumberRangeFilter`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts):
  the event is emitted after the user clicks the button, using the `filter` prop as its payload.

## See it in action

This component renders a button which, on clicked, emits the `UserClickedAFilter` and the
`UserClickedANumberRangeFilter` events. By default, it renders the filter label as the button text.

The `filter` prop is required. The `clickEvents` prop is optional and allows configuring the events
to emit on click.

```vue
<template>
  <NumberRangeFilter :filter="filter" />
</template>

<script setup>
import { NumberRangeFilter } from '@empathyco/x-components/facets'
import { ref } from 'vue'

const filter = ref({
  id: `price:1-10`,
  modelName: 'NumberRangeFilter',
  label: `From 1 to 10`,
  facetId: 'price',
  range: {
    min: 1,
    max: 10,
  },
  selected: false,
})
</script>
```

### Playing with props

Configuring the events to emit when the filter is clicked.

```vue
<template>
  <NumberRangeFilter :clickEvents="{ UserClickedANumberRangeFilter: filter }" :filter="filter" />
</template>

<script setup>
import { NumberRangeFilter } from '@empathyco/x-components/facets'
import { ref } from 'vue'

const filter = ref({
  id: `price:1-10`,
  modelName: 'NumberRangeFilter',
  label: `From 1 to 10`,
  facetId: 'price',
  range: {
    min: 1,
    max: 10,
  },
  selected: false,
})
</script>
```

### Customizing its contents

```vue
<template>
  <NumberRangeFilter :filter="filter" v-slot="{ filter }">
    <img src="checkbox.png" />
    <span>{{ filter.label }}</span>
  </NumberRangeFilter>
</template>

<script setup>
import { NumberRangeFilter } from '@empathyco/x-components/facets'
import { ref } from 'vue'

const filter = ref({
  id: `price:1-10`,
  modelName: 'NumberRangeFilter',
  label: `From 1 to 10`,
  facetId: 'price',
  range: {
    min: 1,
    max: 10,
  },
  selected: false,
})
</script>
```
</docs>
