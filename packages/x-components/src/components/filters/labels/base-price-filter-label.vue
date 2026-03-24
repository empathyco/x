<script lang="ts">
import type { RangeValue } from '@empathyco/x-types'
import type { PropType } from 'vue'
import { computed, defineComponent, h } from 'vue'
import BaseCurrency from '../../currency/base-currency.vue'

/**
 * Renders a label for a price filter, allowing to select different messages depending on the
 * value of the filter.
 *
 * @public
 */
export default defineComponent({
  components: { BaseCurrency },
  props: {
    /** The filter data for get min and max value. */
    filter: {
      type: Object as PropType<{ range: RangeValue }>,
      required: true,
    },
    /** Configuration for show the label. */
    format: {
      type: String,
    },
    /**
     * Message shown when the filter hasn't got the min value defined.
     *
     * @public
     */
    lessThan: {
      type: String,
      required: true,
    },
    /**
     * Message shown when the filter has both the min and max values defined.
     *
     * @public
     */
    fromTo: {
      type: String,
      required: true,
    },
    /**
     * Message shown when the filter hasn't got max value defined.
     *
     * @public
     */
    from: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    /**
     * The active label, retrieved from the provided props.
     * It depends on the min and max values of the filter.
     *
     * @returns The active label to be formatted with the min and max values of the filter.
     */
    const label = computed<string>(() => {
      return props.filter.range.min === null
        ? props.lessThan
        : props.filter.range.max === null
          ? props.from
          : props.fromTo
    })

    return () => {
      const labelParts = label.value.split(/(\{min\}|\{max\})/)

      const children = labelParts.map(partMessage => {
        if (partMessage === '{min}') {
          return h(BaseCurrency, {
            value: props.filter.range.min as number,
            format: props.format,
          })
        } else if (partMessage === '{max}') {
          return h(BaseCurrency, {
            value: props.filter.range.max as number,
            format: props.format,
          })
        }
        return partMessage
      })

      return h('span', { class: 'x-price-filter-label' }, children)
    }
  },
})
</script>

<docs lang="mdx">
## Example

Renders a label for a price filter, allowing to select different messages depending on the value of
the filter.

- When the `min` value property isn't defined in the filter, you can show a message like
  `Less than $10` by using the `lessThan` prop, combined with the `{max}` placeholder.
- When the `max` value property isn't defined in the filter, you can show a message like
  `More than $300` by using the `from` prop, combined with the `{min}` placeholder.
- If both the `min` and `max` values of the filter are defined, you can show a message like
  `$10 - $300` by using the `fromTo` prop.

This component uses internally the `BaseCurrency` one, so you can pass the same props to configure
how the price should look like.

### Basic usage

```vue
<template>
  <Facets>
    <template #price="{ facet }">
      <Filters v-slot="{ filter }" :filters="facet.filters">
        <NumberRangeFilter :filter="filter" v-slot="{ filter }">
          <BasePriceFilterLabel
            :filter="filter"
            format="$i"
            lessThan="Less than {max}"
            fromTo="From {min} to {max}"
            from="More than {min}"
          />
        </NumberRangeFilter>
      </Filters>
    </template>
  </Facets>
</template>

<script setup>
import BasePriceFilterLabel from '@empathyco/x-components/js/components/filters/labels/base-price-filter-label.vue'
import { Filters, Facets, NumberRangeFilter } from '@empathyco/x-components/facets'
</script>
```
</docs>
