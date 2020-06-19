<template>
  <span :class="dynamicClasses" class="x-result-current-price" data-test="result-current-price">
    {{ currencyFilter(result.price.value) }}
  </span>
</template>
<script lang="ts">
  import { Result } from '@empathy/search-types';
  import { Component, Prop } from 'vue-property-decorator';
  import Vue from 'vue';
  import { currency } from '../filters/currency/currency.filter';
  import { CurrencyOptions } from '../i18n/currency.types';
  import { VueCSSClasses } from '../utils/types';

  /**
   * Component to be reused that represents a `<span>` with the current price that may or
   * may not be on sale.
   *
   * @public
   */
  @Component
  export default class BaseResultCurrentPrice extends Vue {
    /**
     * (Required) The {@link @empathy/search-types#Result | result} information.
     *
     * @public
     */
    @Prop({ required: true })
    protected result!: Result;

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

  This component is a span that shows the current price formatted using a currency filter.

  ```vue
  <BaseResultCurrentPrice :result="result"/>
  ```
</docs>
