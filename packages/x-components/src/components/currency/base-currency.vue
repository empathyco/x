<template>
  <span class="x-currency">{{ formatted }}</span>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';

  const FORMAT_REGEX = /(i([^id]+))?i+(([^id]+)(d+))?/;
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
    @Prop({ required: false, default: 'i.iii,dd' })
    protected format!: string;

    /**
     * If true and the value is an integer without decimals, the decimal part is hidden including
     * the decimal separator.
     * If false, the default behaviour will fill with zeros the remaining length until getting
     * the one defined with the 'd's.
     *
     * @public
     */
    @Prop({ required: false, default: false })
    protected hideIntegerDecimals!: boolean;

    /**
     * Function that divide fhe format passed as value for get integerSeparator, decimalSeparator
     * and decimalsNumber.
     *
     * @returns Object with properties of the currency config.
     */
    protected get currencyConfig(): CurrencyConfig {
      const [, , integerSeparator = '', , decimalSeparator = '', decimals = ''] =
        FORMAT_REGEX.exec(this.format) ?? [];

      return {
        integerSeparator,
        decimalSeparator,
        decimalsNumber: decimals.length
      };
    }

    /**
     * Divide the number in two parts by separatos '.', one of them is the integer number and other
     * the decimals numbers.
     *
     * @returns Parts of number.
     */
    protected get numberParts(): NumberParts {
      const [integer, decimal = ''] = `${this.value}`.split('.');

      return {
        integer,
        decimal
      };
    }

    /**
     * Returns the formatted result as string. It replaces the integer part, the decimal separator
     * and the decimal part from the format string with the formatted ones.
     *
     * @returns Formatted number.
     *
     * @internal
     */
    protected get formatted(): string {
      return this.format.replace(
        FORMAT_REGEX,
        `${this.formattedInteger}${this.formattedDecimalSeparator}${this.formattedDecimal}`
      );
    }

    /**
     * Returns the formatted integer part. This computed returns:
     * - integer part with the integer separator added.
     *
     * The regexp adds the integer separator for each thousand group (each 3 numbers).
     *
     * @returns Formatted integer.
     * @internal
     */
    protected get formattedInteger(): string {
      return this.numberParts.integer.replace(
        /\B(?=(\d{3})+(?!\d))/g,
        this.currencyConfig.integerSeparator
      );
    }

    /**
     * Returns the formatted decimal. This computed returns:
     * - decimal part filled with zeros until complete remaining slots defined with the decimal
     * length in the format.
     * - decimal part truncated. The decimal numbers length, defined with the number of 'd's in the
     * format prop. This must MATCH with the number of decimals provided from the adapter.
     *
     * @returns Formatted integer.
     * @internal
     */
    protected get formattedDecimal(): string {
      return this.showDecimals
        ? this.numberParts.decimal
            .padEnd(this.currencyConfig.decimalsNumber, '0')
            .substring(0, this.currencyConfig.decimalsNumber)
        : '';
    }

    /**
     * Formatted decimal separator.
     * Returns the decimal separator set or empty string if the option 'hideIntegerDecimals' is true
     * and the value is an integer, or if there are no decimals number defined.
     *
     * @returns Decimal separator or empty string.
     *
     * @internal
     */
    protected get formattedDecimalSeparator(): string {
      return this.showDecimals && this.currencyConfig.decimalsNumber
        ? this.currencyConfig.decimalSeparator
        : '';
    }

    /**
     * Show decimals, including the decimal separator if:
     * - 'hideIntegerDecimals' option is false.
     * - 'hideIntegerDecimals' option is true and number is not an integer.
     *
     * @returns True if decimal part has to be displayed.
     * @internal
     */
    protected get showDecimals(): boolean {
      return !this.hideIntegerDecimals || !Number.isInteger(+this.value);
    }
  }

  /**
   * Configuration for format currency.
   */
  interface CurrencyConfig {
    /** The character between a group of three integer 'i's and the following one. */
    integerSeparator: string;
    /** The character between a group of three integer 'i's and the following one. It also
     * supports more than one single character. */
    decimalSeparator: string;
    /** Length of decimals numbers. It counts the number of 'd's after the integer part. */
    decimalsNumber: number;
  }

  /**
   * Parts of number: integer and decimal.
   */
  interface NumberParts {
    /** Integer part of the number as string. */
    integer: string;
    /** Decimal part of the number as string. */
    decimal: string;
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
