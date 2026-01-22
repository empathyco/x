<template>
  <RenderlessFilter
    v-slot="{ filter: filterBinding, clickFilter, isDisabled, cssClasses: cssClassesBinding }"
    :filter="filter"
    :click-events="innerClickEvents"
    :css-classes="innerCssClasses"
  >
    <!--
      @slot The control element to render
      @binding {Filter} filter - The filter data
      @binding {() => void} clickFilter - Method that will invoke the needed actions after the user
      clicks the filter.
      @binding {Boolean} isDisabled - True if the filter shouldn't be able to be selected by the
      user
      @binding {Object} cssClasses - Object containing CSS classes to add to the button
    -->
    <slot
      v-bind="{
        filter: filterBinding,
        clickFilter,
        isDisabled,
        cssClasses: cssClassesBinding,
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
import type { SimpleFilter as SimpleFilterModel } from '@empathyco/x-types'
import type { Dictionary } from '@empathyco/x-utils'
import type { PropType } from 'vue'
import type { XEventsTypes } from '../../../../wiring/events.types'
import { computed, defineComponent } from 'vue'
import { facetsXModule } from '../../x-module'
import RenderlessFilter from './renderless-filter.vue'

/**
 * Renders a simple filter, emitting the needed events when clicked.
 *
 * @public
 */
export default defineComponent({
  name: 'SimpleFilter',
  xModule: facetsXModule.name,
  components: { RenderlessFilter },
  inheritAttrs: false,
  props: {
    /** The filter data to render. */
    filter: {
      type: Object as PropType<SimpleFilterModel>,
      required: true,
    },
    /** Additional events, with their payload, to emit when the filter is clicked. */
    clickEvents: Object as PropType<Partial<XEventsTypes>>,
    /** Inheritance CSS classes. */
    cssClasses: {
      type: Array as PropType<(string | Dictionary<boolean>)[]>,
      default: () => [],
    },
  },
  setup(props) {
    /** The {@link XEventsTypes} to emit. */
    const innerClickEvents = computed(() => ({
      UserClickedASimpleFilter: props.filter,
      ...props.clickEvents,
    }))

    /** CSS classes to apply to the element. */
    const innerCssClasses = computed(() => [
      'x-simple-filter',
      { 'x-simple-filter--is-selected': props.filter.selected },
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

A list of events that the component will emit:

- [`UserClickedAFilter`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts):
  the event is emitted after the user clicks the button, using the `filter` prop as its payload.
- [`UserClickedASimpleFilter`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts):
  the event is emitted after the user clicks the button, using the `filter` prop as its payload.

## See it in action

This component renders a button, which on clicked emits the `UserClickedAFilter` and the
`UserClickedASimpleFilter` events. By default, it renders a `button` with the `filter.label`
property as text.

The `filter` prop is required. The `clickEvents` prop is optional and allows configuring the events
to emit on click.

```vue
<template>
  <SimpleFilter :filter="filter" />
</template>

<script setup>
import { SimpleFilter } from '@empathyco/x-components/facets'
import { ref } from 'vue'

const filter = ref({
  modelName: 'SimpleFilter',
  selected: false,
  id: 'category:shirts',
  value: 'category:shirts',
  facetId: 'category',
  totalResults: 10,
})
</script>
```

### Playing with props

Configuring the events to emit when the filter is clicked.

```vue
<template>
  <SimpleFilter :clickEvents="{ UserClickedASimpleFilter: filter }" :filter="filter" />
</template>

<script setup>
import { SimpleFilter } from '@empathyco/x-components/facets'
import { ref } from 'vue'

const filter = ref({
  modelName: 'SimpleFilter',
  selected: false,
  id: 'category:shirts',
  value: 'category:shirts',
  facetId: 'category',
  totalResults: 10,
})
</script>
```

### Rendering an input

You can change the rendered control using the default slot. Note that because of the current Vue
limitations, you must only render one single root node in this slot. There you will receive all the
data and methods needed:

```vue
<template>
  <SimpleFilter v-slot="{ filter, clickFilter, isDisabled, cssClasses }" :filter="filter">
    <label :class="cssClasses">
      <input :checked="filter.selected" type="checkbox" @change="clickFilter" />
      {{ filter.label }}
    </label>
  </SimpleFilter>
</template>

<script setup>
import { SimpleFilter } from '@empathyco/x-components/facets'
import { ref } from 'vue'

const filter = ref({
  modelName: 'SimpleFilter',
  selected: false,
  id: 'category:shirts',
  value: 'category:shirts',
  facetId: 'category',
  label: 'Shirts',
  totalResults: 10,
})
</script>
```

### Changing default button content

You can change the content rendered by the default button using the `label` slot. There you will
receive the filter data.

```vue
<template>
  <SimpleFilter :filter="filter">
    <template #label="{ filter }">
      <img :src="`imgs/filters/${filter.id}.png`" />
      <span>{{ filter.label }}</span>
    </template>
  </SimpleFilter>
</template>

<script setup>
import { SimpleFilter } from '@empathyco/x-components/facets'
import { ref } from 'vue'

const filter = ref({
  modelName: 'SimpleFilter',
  selected: false,
  id: 'category:shirts',
  value: 'category:shirts',
  facetId: 'category',
  label: 'Shirts',
  totalResults: 10,
})
</script>
```
</docs>
