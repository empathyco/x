<template>
  <div :class="dynamicClasses" class="x-result-current-price" data-test="result-current-price">
    <!--
      @slot Base currency item
          @binding {result} result - Result data
    -->
    <slot :result="result">
      <BaseCurrency :value="result.price.value" :format="format" />
    </slot>
  </div>
</template>

<script lang="ts">
import type { Result } from '@empathyco/x-types'
import type { PropType } from 'vue'
import type { VueCSSClasses } from '../../utils/types'
import { computed, defineComponent } from 'vue'
import BaseCurrency from '../currency/base-currency.vue'

/**
 * Component that renders the {@link @empathyco/x-types#Result} current price
 * that may or may not be on sale.
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
     * - Default mask: 'i.iii,dd' which returns '1.345,67'.
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
  setup(props) {
    /**
     * Dynamic CSS classes to add to the root element of this component.
     *
     * @returns A booleans dictionary where each key is the class name to add,
     * and the boolean value tells if it should be added or not.
     * @internal
     */
    const dynamicClasses = computed<VueCSSClasses>(() => ({
      'x-result-current-price--on-sale': props.result.price?.hasDiscount ?? false,
    }))

    return {
      dynamicClasses,
    }
  },
})
</script>

<docs lang="mdx">
## Examples

### Basic example

This component shows the current price formatted. You can provide the `format` by property or let
the `BaseCurrency` component use an injected one.

```vue
<template>
  <BaseResultCurrentPrice :result="result" :format="'i.iii,ddd €'" />
</template>

<script setup>
import { BaseResultCurrentPrice } from '@empathyco/x-components'
const result = {
  price: { value: 123.45, hasDiscount: false },
  // ...other result properties
}
</script>
```

### Overriding default slot

```vue
<template>
  <BaseResultCurrentPrice :result="result">
    <span class="custom-base-result-current-price">{{ result.price.value }}</span>
  </BaseResultCurrentPrice>
</template>

<script setup>
import { BaseResultCurrentPrice } from '@empathyco/x-components'
const result = {
  price: { value: 123.45, hasDiscount: false },
  // ...other result properties
}
</script>
```
</docs>
