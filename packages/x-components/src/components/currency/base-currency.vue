<template>
  <span class="x-currency">{{ currency }}</span>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { currencyFormatter } from '../../utils/currency-formatter';

  /**
   * Renders the value received as a property, which always must be a JavaScript number, with the
   * proper format provided as string property. The rendered tag is a span in order to render a
   * default inline HTML element.
   *
   * @example
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
  @Component
  export default class BaseCurrency extends Vue {
    /**
     * Numeric value to be formatted.
     *
     * @remarks Pass the value with 'v-bind:value' (or ':value' shortcut) instead of plain string.
     * @remarks Be careful using numbers under Number.MAX_SAFE_INTEGER to avoid unexpected errors.
     *
     * @public
     */
    @Prop({ required: true })
    protected value!: number;

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
    @Prop({ default: 'i.iii,dd' })
    protected format!: string;

    /**
     * If true and the value is an integer without decimals, the decimal part is hidden including
     * the decimal separator.
     * If false, the default behaviour will fill with zeros the remaining length until getting
     * the one defined with the 'd's.
     *
     * @public
     */
    @Prop({ default: false })
    protected hideIntegerDecimals!: boolean;

    /**
     * Returns the formatted result as string.
     *
     * @returns Formatted number.
     *
     * @internal
     */
    protected get currency(): string {
      return currencyFormatter(this.value, this.format, this.hideIntegerDecimals);
    }
  }
</script>

<docs lang="mdx">
# Example

Renders the value received as a property, which always must be a JavaScript number, with the proper
format provided as string property. The rendered tag is a span in order to render a default inline
HTML element.

## Basic usage

### Example

```vue
<BaseCurrency :value="12345678.87654321" format="i.iii,ddd €" :hide-integer-decimals="true" />
<!-- output: '12.345.678,876 €' -->
<BaseCurrency :value="12345678" format="i.iii,ddd €" :hide-integer-decimals="true" />
<!-- output: '12.345.678 €' -->
<BaseCurrency :value="12345678.87654321" format="$ i.iii,dd" :hide-integer-decimals="false" />
<!-- output: '$ 12.345.678,87' -->
<BaseCurrency :value="12345678.87654321" format="$i.iii,dd" :hide-integer-decimals="false" />
<!-- output: '$12.345.678,87' -->
<BaseCurrency :value="12345678.87654321" format="i.iii,dd €" :hide-integer-decimals="false" />
<!-- output: '12.345.678,87 €' -->
<BaseCurrency :value="12345678.87654321" format="i.iii,dd€" :hide-integer-decimals="false" />
<!-- output: '12.345.678,87€' -->
<BaseCurrency :value="12345678.87654321" format="i,iii.dd €" :hide-integer-decimals="false" />
<!-- output: '12,345,678.87 €' -->
<BaseCurrency :value="12345678.87654321" format="i iii.dd €" :hide-integer-decimals="false" />
<!-- output: '12 345 678.87 €' -->
<BaseCurrency :value="12345678.87654321" format="i iii - dd €" :hide-integer-decimals="false" />
<!-- output: '12 345 678 - 87 €' -->
<BaseCurrency :value="12345678.87654321" format="i.iii,dddddd €" :hide-integer-decimals="false" />
<!-- output: '12.345.678,876543 €' -->
<BaseCurrency :value="12345678.87" format="i.iii,dddddd €" :hide-integer-decimals="false" />
<!-- output: '12.345.678,870000 €' -->
<BaseCurrency :value="12345678" format="i.iii,dddddd €" :hide-integer-decimals="false" />
<!-- output: '12.345.678,000000 €' -->
<BaseCurrency :value="12345678.87654321" format="i.iii,dd €" :hide-integer-decimals="false" />
<!-- output: '12.345.678,87 €' -->
<BaseCurrency :value="12345678.87654321" format="i.iii €" :hide-integer-decimals="false" />
<!-- output: '12.345.678 €' -->
```
</docs>
