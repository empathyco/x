<template>
  <BaseRating class="x-rating-filter-label" data-test="rating-label" :value="value" :max="max">
    <template #filled-icon>
      <!--
       @slot Filled icon content
     -->
      <slot name="rating-icon-filled" />
    </template>
    <template #empty-icon>
      <!--
       @slot Empty icon content
     -->
      <slot name="rating-icon-empty" />
    </template>
  </BaseRating>
</template>

<script lang="ts">
import type { BooleanFilter } from '@empathyco/x-types'
import type { PropType } from 'vue'
import { computed, defineComponent } from 'vue'
import BaseRating from '../../base-rating.vue'

/**
 * Renders a label for a rating filter, allowing to override the elements used to paint
 * the rating.
 *
 * @public
 */
export default defineComponent({
  components: {
    BaseRating,
  },
  props: {
    /**
     * The filter data to render.
     *
     * @public
     */
    filter: {
      type: Object as PropType<BooleanFilter>,
      required: true,
    },
    /**
     * Maximum number of elements to paint.
     *
     * @public
     */
    max: {
      type: Number,
      default: 5,
    },
  },
  setup(props) {
    /**
     * Converts the label string into a number.
     *
     * @returns The label as number or 0 if it is not a valid number.
     *
     * @internal
     */
    const value = computed<number>(() => {
      const x = Number.parseFloat(props.filter.label) ?? 0
      return Number.isNaN(x) ? 0 : x
    })

    return {
      value,
    }
  },
})
</script>

<docs lang="mdx">
## Example

Renders a label for a rating filter, allowing to override the elements used to paint the rating. The
filter label must be a valid number string. For example: '3', '2.5', '0.25'

### Basic usage

```vue
<template>
  <BaseRatingFilterLabel :filter="filter" />
</template>

<script setup>
import BaseRatingFilterLabel from '@empathyco/x-components/js/components/filters/labels/base-rating-filter-label.vue'
// Provide a valid filter object, e.g.:
// const filter = ref({ label: '3', ... })
</script>
```

### Customizing color

It is possible to change the default color directly with the color CSS attribute. For more elaborate
styles, you can style the inner svg icons.

```vue
<template>
  <BaseRatingFilterLabel :filter="filter" style="color: gold" />
</template>

<script setup>
import BaseRatingFilterLabel from '@empathyco/x-components/js/components/filters/labels/base-rating-filter-label.vue'
// Provide a valid filter object
</script>
```

### Customizing its contents

The `max` prop can be used to set the max rating number. It will render as many icons as this `max` value.

```vue
<template>
  <BaseRatingFilterLabel :filter="filter" :max="max" />
</template>

<script setup>
import BaseRatingFilterLabel from '@empathyco/x-components/js/components/filters/labels/base-rating-filter-label.vue'
// Provide a valid filter object and max value
</script>
```

The default icons can be changed using the `rating-icon-filled` and `rating-icon-empty` slots, to
represent the filled and empty icons in the rating component.

```vue
<template>
  <BaseRatingFilterLabel :filter="filter" :max="max">
    <template #rating-icon-filled>♥</template>
    <template #rating-icon-empty>♡</template>
  </BaseRatingFilterLabel>
</template>

<script setup>
import BaseRatingFilterLabel from '@empathyco/x-components/js/components/filters/labels/base-rating-filter-label.vue'
// Provide a valid filter object and max value
</script>
```
</docs>
