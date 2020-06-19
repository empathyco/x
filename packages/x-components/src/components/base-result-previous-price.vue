<template>
  <span
    v-if="result.price.hasDiscount"
    class="x-result-previous-price"
    data-test="result-previous-price"
  >
    {{ currencyFilter(result.price.originalValue) }}
  </span>
</template>

<script lang="ts">
  import { Result } from '@empathy/search-types';
  import { Component, Prop } from 'vue-property-decorator';
  import Vue from 'vue';
  import { currency } from '../filters/currency/currency.filter';
  import { CurrencyOptions } from '../i18n/currency.types';

  /**
   * Component to be reused that represents a `<span>` with the previous price.
   *
   * @public
   */
  @Component
  export default class BaseResultPreviousPrice extends Vue {
    /**
     * (Required) The {@link @empathy/search-types#Result | result} information.
     *
     * @public
     */
    @Prop({ required: true })
    protected result!: Result;

    /**
     * Returns the currency filter.
     *
     * @returns The currency filter instance.
     *
     * @public
     */
    protected get currencyFilter(): (value: number, options?: Partial<CurrencyOptions>) => string {
      return currency;
    }
  }
</script>

<docs>
  #Examples

  ## Basic example

  This component is a span that will shows the previous price if it has discount and it will be
  formatted using a currency filter.

  ```vue
  <BaseResultPreviousPrice :result="result"/>
  ```
</docs>
