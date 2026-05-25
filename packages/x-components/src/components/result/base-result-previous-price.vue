<template>
  <div
    v-if="result.price?.hasDiscount"
    class="x-result-previous-price"
    data-test="result-previous-price"
  >
    <!--
      @slot Base currency item
         @binding {result} result - Result data
    -->
    <slot :result="result">
      <BaseCurrency
        v-if="result.price?.originalValue"
        :value="result.price.originalValue"
        :currency="currency"
        :format="format"
      />
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
})
</script>

<docs lang="mdx">
## Examples

### Basic example

This component shows the previous price formatted if it has discount. The component has optional
`currency` and `format` props to customize the display.

```vue
<template>
  <BaseResultPreviousPrice :result="result" currency="USD" />
</template>

<script setup>
import { BaseResultPreviousPrice } from '@empathyco/x-components'

const result = {
  price: { originalValue: 199.99, hasDiscount: true },
  // ...other result properties
}
</script>
```

### Customizing format

You can customize the number formatting using the `format` prop with `Intl.NumberFormatOptions`:

```vue
<template>
  <BaseResultPreviousPrice
    :result="result"
    currency="EUR"
    :format="{ minimumFractionDigits: 2, maximumFractionDigits: 2 }"
  />
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
