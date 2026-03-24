<template>
  <span v-if="value !== undefined" class="x-currency">{{ currency }}</span>
</template>

<script lang="ts">
import { computed, defineComponent, inject } from 'vue'
import { currencyFormatter } from '../../utils/currency-formatter'

/**
 * Renders the value received as a property which always must be a JavaScript number, with the
 * proper format provided as a string property or by injection. The rendered tag is a span in
 * order to render a default inline HTML element.
 *
 * Regarding the format or mask to be defined as string:
 * - Use 'i' to define integer numbers.
 * - Use 'd' to define decimal numbers. You can define the length of the decimal part. If the
 * format doesn't include decimals, it is filled with zeros until reach the length defined with
 * 'd's.
 * - Integer separator must be defined between the 3rd and the 4th integer 'i' of a group.
 * - Decimal separator must be defined between the last 'i' and the first 'd'. It can be more
 * than one character.
 * - If you want to hide the decimal part if it's zero, you can add the `?` symbol after the
 * decimal characters (e.g. 'i.iii,dd?', for `1234` you would get `1.234` instead of `1.234,00`).
 * - Set whatever you need around the integers and decimals marks.
 * - Default mask: 'i.iii,dd' which returns '1.345,67'.
 *
 * @remarks The number of 'd', which is the maximum decimal length, MUST matches with the length
 * of decimals provided from the adapter. Otherwise, when the component truncate the decimal
 * part, it deletes significant digits.
 *
 * Basic example:
 *
 * ```vue
 * <BaseCurrency
 *   :value="123456.789"
 *   format="i.iiii,dddd €"
 * />
 * ```
 *
 * It will render: `123.456,7890 €`.
 *
 * See docs below for more examples.
 *
 * @public
 */
export default defineComponent({
  props: {
    /**
     * Numeric value to be formatted.
     *
     * @remarks Pass the value with 'v-bind:value' (or ':value' shortcut) instead of plain string.
     * @remarks Be careful using numbers under Number.MAX_SAFE_INTEGER to avoid unexpected errors.
     *
     * @public
     */
    value: {
      type: Number,
      required: true,
    },

    /**
     * The format as string.
     *
     * @public
     */
    format: {
      type: String,
    },
  },

  setup(props) {
    /**
     * The injected format as string.
     *
     * @public
     */
    const injectedFormat = inject<string>('currencyFormat', 'i.iii,dd')

    /**
     * A format which can be passed through prop or injected.
     *
     * @returns A format as string.
     *
     * @internal
     */
    const renderedFormat = computed<string>(() => props.format ?? injectedFormat)

    /**
     * Returns the formatted result as string.
     *
     * @returns Formatted number.
     *
     * @internal
     */
    const currency = computed<string>(() => currencyFormatter(props.value, renderedFormat.value))

    return {
      currency,
    }
  },
})
</script>

<docs lang="mdx">
## Example

Renders the value received as a property, which always must be a JavaScript number, with the proper
format provided as string property. The rendered tag is a span in order to render a default inline
HTML element.

### Basic usage

```vue
<template>
  <BaseCurrency :value="12345678.87654321" />
  <!-- output: '12.345.678,87' -->
</template>

<script setup>
import BaseCurrency from '@empathyco/x-components/js/components/currency/base-currency.vue'
</script>
```

```vue
<template>
  <BaseCurrency :value="12345678.87654321" format="i.iii,ddd? €" />
  <!-- output: '12.345.678,876 €' -->
</template>

<script setup>
import BaseCurrency from '@empathyco/x-components/js/components/currency/base-currency.vue'
</script>
```

```vue
<template>
  <BaseCurrency :value="12345678" format="i.iii,ddd? €" />
  <!-- output: '12.345.678 €' -->
</template>

<script setup>
import BaseCurrency from '@empathyco/x-components/js/components/currency/base-currency.vue'
</script>
```

```vue
<template>
  <BaseCurrency :value="12345678.87654321" format="$ i.iii,dd" />
  <!-- output: '$ 12.345.678,87' -->
</template>

<script setup>
import BaseCurrency from '@empathyco/x-components/js/components/currency/base-currency.vue'
</script>
```

```vue
<template>
  <BaseCurrency :value="12345678.87654321" format="$i.iii,dd" />
  <!-- output: '$12.345.678,87' -->
</template>

<script setup>
import BaseCurrency from '@empathyco/x-components/js/components/currency/base-currency.vue'
</script>
```

```vue
<template>
  <BaseCurrency :value="12345678.87654321" format="i.iii,dd €" />
  <!-- output: '12.345.678,87 €' -->
</template>

<script setup>
import BaseCurrency from '@empathyco/x-components/js/components/currency/base-currency.vue'
</script>
```

```vue
<template>
  <BaseCurrency :value="12345678.87654321" format="i.iii,dd€" />
  <!-- output: '12.345.678,87€' -->
</template>

<script setup>
import BaseCurrency from '@empathyco/x-components/js/components/currency/base-currency.vue'
</script>
```

```vue
<template>
  <BaseCurrency :value="12345678.87654321" format="i,iii.dd €" />
  <!-- output: '12,345,678.87 €' -->
</template>

<script setup>
import BaseCurrency from '@empathyco/x-components/js/components/currency/base-currency.vue'
</script>
```

```vue
<template>
  <BaseCurrency :value="12345678.87654321" format="i iii.dd €" />
  <!-- output: '12 345 678.87 €' -->
</template>

<script setup>
import BaseCurrency from '@empathyco/x-components/js/components/currency/base-currency.vue'
</script>
```

```vue
<template>
  <BaseCurrency :value="12345678.87654321" format="i iii - dd €" />
  <!-- output: '12 345 678 - 87 €' -->
</template>

<script setup>
import BaseCurrency from '@empathyco/x-components/js/components/currency/base-currency.vue'
</script>
```

```vue
<template>
  <BaseCurrency :value="12345678.87654321" format="i.iii,dddddd €" />
  <!-- output: '12.345.678,876543 €' -->
</template>

<script setup>
import BaseCurrency from '@empathyco/x-components/js/components/currency/base-currency.vue'
</script>
```

```vue
<template>
  <BaseCurrency :value="12345678.87" format="i.iii,dddddd €" />
  <!-- output: '12.345.678,870000 €' -->
</template>

<script setup>
import BaseCurrency from '@empathyco/x-components/js/components/currency/base-currency.vue'
</script>
```

```vue
<template>
  <BaseCurrency :value="12345678" format="i.iii,dddddd €" />
  <!-- output: '12.345.678,000000 €' -->
</template>

<script setup>
import BaseCurrency from '@empathyco/x-components/js/components/currency/base-currency.vue'
</script>
```

```vue
<template>
  <BaseCurrency :value="12345678.87654321" format="i.iii,dd €" />
  <!-- output: '12.345.678,87 €' -->
</template>

<script setup>
import BaseCurrency from '@empathyco/x-components/js/components/currency/base-currency.vue'
</script>
```

```vue
<template>
  <BaseCurrency :value="12345678.87654321" format="i.iii €" />
  <!-- output: '12.345.678 €' -->
</template>

<script setup>
import { BaseCurrency } from '@empathyco/x-components/js/components/currency/base-currency.vue'
</script>
```
</docs>
