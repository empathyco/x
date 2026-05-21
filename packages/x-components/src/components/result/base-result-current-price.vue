<template>
  <div :class="dynamicClasses" class="x-result-current-price" data-test="result-current-price">
    <!--
      @slot Base currency item
          @binding {result} result - Result data
    -->
    <slot :result="result">
      <BaseCurrency
        v-if="result.price?.value"
        :value="result.price.value"
        :currency="currency"
        :format="format"
      />
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
     * Optional value coming from https://en.wikipedia.org/wiki/ISO_4217#List_of_ISO_4217_currency_codes.
     *
     * @public
     */
    currency: String,
    /**
     * The currency format possibilities from Intl.NumberFormatOptions.
     * Allows customization of decimal places, grouping, etc.
     *
     * @public
     */
    format: {
      type: Object as PropType<Omit<Intl.NumberFormatOptions, 'currency' | 'style'>>,
      default: () => ({}),
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

This component shows the current price formatted. You can provide the `currency` and `format`
properties to customize the display.

```vue
<template>
  <BaseResultCurrentPrice :result="result" currency="USD" />
</template>

<script setup>
import { BaseResultCurrentPrice } from '@empathyco/x-components'
const result = {
  price: { value: 123.45, hasDiscount: false },
  // ...other result properties
}
</script>
```

### Customizing format

You can customize the number formatting using the `format` prop with `Intl.NumberFormatOptions`:

```vue
<template>
  <BaseResultCurrentPrice
    :result="result"
    currency="EUR"
    :format="{ minimumFractionDigits: 2, maximumFractionDigits: 2 }"
  />
</template>

<script setup>
import { BaseResultCurrentPrice } from '@empathyco/x-components'
const result = {
  price: { value: 123.456, hasDiscount: false },
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
