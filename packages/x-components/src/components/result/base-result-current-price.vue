<template>
  <div :class="dynamicClasses" class="x-result-current-price" data-test="result-current-price">
    <!--
      @slot Base currency item
          @binding {result} result - Result data
    -->
    <slot :result="result">
      <BaseCurrency
        :value="result.price.value"
        :format="format"
        :hideIntegerDecimals="hideIntegerDecimals"
      />
    </slot>
  </div>
</template>

<script lang="ts">
  import { Result } from '@empathyco/x-types';
  import { Component, Prop } from 'vue-property-decorator';
  import Vue from 'vue';
  import { VueCSSClasses } from '../../utils/types';
  import BaseCurrency from '../currency/base-currency.vue';

  /**
   * Component that renders the {@link @empathyco/x-types#Result | result} current price
   * that may or may not be on sale.
   *
   * @public
   */
  @Component({
    components: { BaseCurrency }
  })
  export default class BaseResultCurrentPrice extends Vue {
    /**
     * (Required) The {@link @empathyco/x-types#Result | result} information.
     *
     * @public
     */
    @Prop({ required: true })
    protected result!: Result;

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
     * Dynamic CSS classes to add to the root element of this component.
     *
     * @returns A booleans dictionary where each key is the class name to add, and the boolean value
     * tells if it should be added or not.
     * @internal
     */
    protected get dynamicClasses(): VueCSSClasses {
      return {
        'x-result-current-price--on-sale': this.result.price.hasDiscount
      };
    }
  }
</script>

<docs>
  #Examples

  ## Basic example

  This component shows the current price formatted. The component has two
  optional props. `format` to select the currency format to be applied and
  `hideIntegerDecimals` to hide or not the decimal part.

  ```vue
  <BaseResultCurrentPrice
    :value="result"
    :format="'i.iii,ddd €'"
    :hideIntegerDecimals="true" />
  ```

  ## Overriding default slot

  ```vue
  <BaseResultCurrentPrice :result="result">
    <span class="custom-base-result-current-price">{{ result.price.value }}</span>
  </BaseResultCurrentPrice>
  ```
</docs>
