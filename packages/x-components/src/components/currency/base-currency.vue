<template>
  <span class="x-currency">{{ currencyText }}</span>
</template>

<script lang="ts">
import type { SnippetConfig } from '@x/x-installer'
import type { PropType } from 'vue'
import { computed, defineComponent, inject } from 'vue'

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
     * The ISO 4217 currency value. If not specified we use snippetConfig.currency
     *
     * @public
     */
    currency: String,
    /**
     * The currency format possibilities from Intl.NumberFormatOptions.
     * Allows customization of decimal places, grouping, etc.
     * Note: 'currency' and 'style' options are managed internally.
     *
     * @public
     */
    format: {
      type: Object as PropType<Omit<Intl.NumberFormatOptions, 'currency' | 'style'>>,
      default: () => ({}),
    },
    /**
     * Locale used to format the value. If not specified we use snippetConfig.uiLang
     *
     * @public
     */
    locale: String,
  },

  setup(props) {
    const snippetConfig = inject<SnippetConfig>('snippetConfig')

    const currencyText = computed<string>(() => {
      const currency = props.currency ?? snippetConfig?.currency ?? 'EUR'
      const locale = props.locale ?? snippetConfig?.uiLang
      return Intl.NumberFormat(locale, {
        style: 'currency',
        ...props.format,
        currency,
      }).format(props.value)
    })

    return {
      currencyText,
    }
  },
})
</script>

<docs lang="mdx">
## Example

Renders the value received as a property, which always must be a JavaScript number, formatted
using the Intl.NumberFormat API with ISO 4217 currency codes. The rendered tag is a span in order
to render a default inline HTML element.

### Basic usage

```vue
<template>
  <BaseCurrency :value="12345678.87654321" currency="EUR" />
  <!-- output depends on locale, e.g., '12.345.678,88 €' for es-ES -->
</template>

<script setup>
import BaseCurrency from '@empathyco/x-components/js/components/currency/base-currency.vue'
</script>
```

### Customizing decimal places

```vue
<template>
  <BaseCurrency
    :value="12345678.87654321"
    currency="USD"
    :format="{ minimumFractionDigits: 3, maximumFractionDigits: 3 }"
  />
  <!-- output: '$12,345,678.877' for en-US locale -->
</template>

<script setup>
import BaseCurrency from '@empathyco/x-components/js/components/currency/base-currency.vue'
</script>
```

### No decimal places

```vue
<template>
  <BaseCurrency
    :value="12345678.87"
    currency="EUR"
    :format="{ minimumFractionDigits: 0, maximumFractionDigits: 0 }"
  />
  <!-- output: '12.345.679 €' for es-ES locale (rounds up) -->
</template>

<script setup>
import BaseCurrency from '@empathyco/x-components/js/components/currency/base-currency.vue'
</script>
```

### Using different currencies

```vue
<template>
  <div>
    <BaseCurrency :value="1234.56" currency="USD" />
    <!-- output: '$1,234.56' for en-US -->
    <BaseCurrency :value="1234.56" currency="EUR" />
    <!-- output: '1.234,56 €' for es-ES -->
    <BaseCurrency :value="1234.56" currency="GBP" />
    <!-- output: '£1,234.56' for en-GB -->
    <BaseCurrency :value="1234.56" currency="JPY" />
    <!-- output: '¥1,235' for ja-JP -->
  </div>
</template>

<script setup>
import BaseCurrency from '@empathyco/x-components/js/components/currency/base-currency.vue'
</script>
```

### Advanced formatting options

You can pass any valid Intl.NumberFormatOptions (except 'currency' and 'style' which are managed
internally):

```vue
<template>
  <BaseCurrency
    :value="1234567.89"
    currency="EUR"
    :format="{
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
      useGrouping: true,
    }"
  />
</template>

<script setup>
import BaseCurrency from '@empathyco/x-components/js/components/currency/base-currency.vue'
</script>
```

### Using a different locale

By default the currency is formatted using the `uiLang` of the `snippetConfig`. You can format
the value in a different locale using the `locale` prop:

```vue
<template>
  <!-- output: '€1,234.56' even if snippetConfig.uiLang is 'es-ES' -->
  <BaseCurrency :value="1234.56" currency="EUR" locale="en-US" />
  <!-- output: '1234,56 €' for snippetConfig.uiLang 'es-ES' -->
  <BaseCurrency :value="1234.56" currency="EUR" />
</template>

<script setup>
import BaseCurrency from '@empathyco/x-components/js/components/currency/base-currency.vue'
</script>
```
</docs>
