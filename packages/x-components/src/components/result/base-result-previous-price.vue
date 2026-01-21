<template>
  <div
    v-if="result.price.hasDiscount"
    class="x-result-previous-price"
    data-test="result-previous-price"
  >
    <!--
      @slot Base currency item
         @binding {result} result - Result data
    -->
    <slot :result="result">
      <BaseCurrency :value="result.price.originalValue" :format="format" />
    </slot>
  </div>
</template>

<script lang="ts">
import type { Result } from '@empathyco/x-types'
import type { PropType } from 'vue'
import { defineComponent } from 'vue'
import BaseCurrency from '../currency/base-currency.vue'

/**
 * Component that renders the {@link @empathyco/x-types#Result} previous price.
 *
 * @public
 */
export default defineComponent({
  components: { BaseCurrency },
  props: {
    /**
     * (Required) The {@link @empathyco/x-types#Result} information.
     *
     * @public
     */
    result: {
      type: Object as PropType<Result>,
      required: true,
    },
    /**
     * Format or mask to be defined as string.
     * - Use 'i' to define integer numbers.
     * - Use 'd' to define decimal numbers. You can define the length of the decimal part. If the
     * doesn't include decimals, it is filled with zeros until reach the length defined with 'd's.
     * - Integer separator must be defined between the 3rd and the 4th integer 'i' of a group.
     * - Decimal separator must be defined between the last 'i' and the first 'd'. It can be more
     * than one character.
     * - Set whatever you need around the integers and decimals marks.
     *
     * @remarks The number of 'd', which is the maximum decimal length, MUST match with the length
     * of decimals provided from the adapter. Otherwise, when the component truncate the decimal
     * part, delete significant digits.
     *
     * @public
     */
    format: {
      type: String,
    },
  },
})
</script>

<docs lang="mdx">
## Examples

### Basic example

This component shows the previous price formatted if it has discount. The component has an optional
`format` prop to select the currency format to be applied.

```vue
<template>
  <BaseResultPreviousPrice :result="result" :format="'i.iii,ddd €'" />
</template>

<script setup>
import { BaseResultPreviousPrice } from '@empathyco/x-components'
const result = {
  price: { originalValue: 199.99, hasDiscount: true },
  // ...other result properties
}
</script>
```

### Overriding default slot

```vue
<template>
  <BaseResultPreviousPrice :result="result">
    <span class="custom-base-result-previous-price">{{ result.price.originalValue }}</span>
  </BaseResultPreviousPrice>
</template>

<script setup>
import { BaseResultPreviousPrice } from '@empathyco/x-components'
const result = {
  price: { originalValue: 199.99, hasDiscount: true },
  // ...other result properties
}
</script>
```
</docs>
