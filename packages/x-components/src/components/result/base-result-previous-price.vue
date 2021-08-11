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
  import { Result } from '@empathyco/x-types';
  import { Component, Prop } from 'vue-property-decorator';
  import Vue from 'vue';
  import BaseCurrency from '../currency/base-currency.vue';

  /**
   * Component that renders the {@link @empathyco/x-types#Result | result} previous price.
   *
   * @public
   */
  @Component({
    components: { BaseCurrency }
  })
  export default class BaseResultPreviousPrice extends Vue {
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
  }
</script>

<docs>
  #Examples

  ## Basic example

  This component shows the previous price formatted if it has discount. The component has two
  optional props. `format` to select the currency format to be applied.

  ```vue
  <BaseResultPreviousPrice
    :value="result"
    :format="'i.iii,ddd €'"
  />
  ```
  ## Overriding default slot
  ```vue
  <BaseResultPreviousPrice :result="result">
    <span class="custom-base-result-previous-price">{{ result.price.originalValue }}</span>
  </BaseResultPreviousPrice>
  ```
</docs>
