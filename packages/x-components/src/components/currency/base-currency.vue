<template>
  <span class="x-currency">{{ currency }}</span>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { currencyFormatter } from '../../utils/currency-formatter';
  import { XInject } from '../decorators/injection.decorators';

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
     * The format as string.
     *
     * @public
     */
    @Prop()
    protected format?: string;

    /**
     * The injected format as string.
     *
     * @public
     */
    @XInject('currencyFormat')
    public injectedFormat!: string;

    /**
     * A format which can be passed through prop or injected.
     *
     * @returns A format as string.
     *
     * @internal
     */
    protected get renderedFormat(): string {
      return (
        this.format ??
        this.injectedFormat ??
        //TODO: add here logger
        //eslint-disable-next-line no-console
        console.warn('It is necessary to pass a prop or inject the format')
      );
    }

    /**
     * Returns the formatted result as string.
     *
     * @returns Formatted number.
     *
     * @internal
     */
    protected get currency(): string {
      return currencyFormatter(this.value, this.renderedFormat);
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
<BaseCurrency :value="12345678.87654321" format="i.iii,ddd? €" />
<!-- output: '12.345.678,876 €' -->
<BaseCurrency :value="12345678" format="i.iii,ddd? €" />
<!-- output: '12.345.678 €' -->
<BaseCurrency :value="12345678.87654321" format="$ i.iii,dd" />
<!-- output: '$ 12.345.678,87' -->
<BaseCurrency :value="12345678.87654321" format="$i.iii,dd" />
<!-- output: '$12.345.678,87' -->
<BaseCurrency :value="12345678.87654321" format="i.iii,dd €" />
<!-- output: '12.345.678,87 €' -->
<BaseCurrency :value="12345678.87654321" format="i.iii,dd€" />
<!-- output: '12.345.678,87€' -->
<BaseCurrency :value="12345678.87654321" format="i,iii.dd €" />
<!-- output: '12,345,678.87 €' -->
<BaseCurrency :value="12345678.87654321" format="i iii.dd €" />
<!-- output: '12 345 678.87 €' -->
<BaseCurrency :value="12345678.87654321" format="i iii - dd €" />
<!-- output: '12 345 678 - 87 €' -->
<BaseCurrency :value="12345678.87654321" format="i.iii,dddddd €" />
<!-- output: '12.345.678,876543 €' -->
<BaseCurrency :value="12345678.87" format="i.iii,dddddd €" />
<!-- output: '12.345.678,870000 €' -->
<BaseCurrency :value="12345678" format="i.iii,dddddd €" />
<!-- output: '12.345.678,000000 €' -->
<BaseCurrency :value="12345678.87654321" format="i.iii,dd €" />
<!-- output: '12.345.678,87 €' -->
<BaseCurrency :value="12345678.87654321" format="i.iii €" />
<!-- output: '12.345.678 €' -->
```
</docs>
